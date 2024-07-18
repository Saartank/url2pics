import asyncio
import os
import shutil

import aioboto3
import imageio

from ..config import (AWS_ACCESS_KEY_ID, AWS_S3_BUCKET_NAME, AWS_S3_REGION,
                      AWS_SECRET_ACCESS_KEY)
from ..logging_config import logger
from .misc import *


async def upload_image_to_s3(filename, s3_client):
    """
    Asynchronously uploads an image to a configured S3 bucket using the provided S3 client.
    """
        
    logger.debug(f"Attempting to upload: {filename}")
    try:
        s3_key = os.path.basename(filename)
        await s3_client.upload_file(filename, AWS_S3_BUCKET_NAME, s3_key)
        s3_url = f"https://{AWS_S3_BUCKET_NAME}.s3.{AWS_S3_REGION}.amazonaws.com/{s3_key}"
        logger.info(f"Uploaded to S3: {s3_url}")
        extension = filename.split(".")[-1]
        img = imageio.v2.imread(filename)
        height, width = img.shape[0], img.shape[1]

        os.remove(filename)
        logger.debug('Image processed: s3_url=%s, width=%d, height=%d, extension=%s', s3_url, width, height, extension)
        return {
            'url': s3_url,
            'width': width,
            'height': height,
            'extension': extension
        }
        
    except Exception as e:
        logger.debug(f"Failed to upload: {filename}")
        logger.error(f"Failed to upload {filename} to S3: {e}")
        return None
    
async def download_and_upload_images(url, download_folder='images'):

    """
    Downloads images from the specified URL, uploads them to a configured S3 bucket, 
    and returns metadata about each image.
    """

    session = aioboto3.Session(
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_S3_REGION
    )

    async with session.client('s3') as s3_client:
        filenames = await download_images(url, download_folder)
        upload_tasks = [upload_image_to_s3(filename, s3_client) for filename in filenames]
        s3_results = await asyncio.gather(*upload_tasks)
        s3_results = [result for result in s3_results if result is not None]

    return s3_results