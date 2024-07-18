import asyncio
import base64
import os
import re
import uuid
from io import BytesIO
from urllib.parse import urljoin, urlparse, urlunparse

import aiohttp
import requests
from PIL import Image
from playwright.async_api import async_playwright

from ..logging_config import logger
from .headless_playwright import download_images_non_headless_browser


async def check_playwright():
    '''
    Validates if playwright is working by opening a simple webpage.
    '''
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.goto('https://www.example.com')
            title = await page.title()
            logger.info(f"Page title: {title}")
            await browser.close()
        logger.debug("Playwright is installed and working correctly.")
        return f"Playwright is installed and working correctly. Page title: {title}"
        
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return f"An error occurred: {e}"

async def download_images(url, download_folder='images'):
    '''
    A redundant wrapper function around the `download_images_non_headless_browser` function. 
    This function was previously used to check specific conditions and only runs the 
    `download_images_non_headless_browser` (a slower method) if the faster method fails. 
    This mechanism did not work properly and is still a work in progress.
    '''
    logger.warning("Running method 2 directly: Non-Headless Browser!")
    filenames = await download_images_non_headless_browser(url, download_folder)
    return filenames


'''
This is the code for older method, which is faster but does not work on all web-pages.
Keeping it in the code base for future reference. 
'''
# async def get_image_urls(url):
#     async with async_playwright() as p:
#         browser = await p.chromium.launch()
#         ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.81"
#         # page = await browser.new_page()
#         page = await browser.new_page(user_agent=ua)

#         try:
#             await page.goto(url, wait_until="networkidle", timeout=3000)
#         except TimeoutError:
#             logger.info("Network idle timeout after 3 seconds. Continuing with processing.")
#         except Exception as e:
#             logger.warning(f"Failed to load page: {e}")
#             logger.warning("Continuing with processing.")
            
        
#         last_position = await page.evaluate('window.scrollY')
#         while True:
#             await page.evaluate("window.scrollBy(0, window.innerHeight)")
#             await page.wait_for_timeout(600)
#             current_position = await page.evaluate('window.scrollY')
#             if current_position == last_position:
#                 break
#             last_position = current_position
        
#         img_elements = await page.query_selector_all('img')
#         img_urls = set()
#         for img in img_elements:
#             src = await img.get_attribute('src') or \
#                   await img.get_attribute('data-src') or \
#                   await img.get_attribute('data-lazy-src') or \
#                   await img.get_attribute('data-srcset') or \
#                   await img.get_attribute('srcset') or \
#                   await img.get_attribute('data-original')
#             if src:
#                 full_url = urljoin(url, src.split()[0])  # Handles srcset by taking the first URL
#                 img_urls.add(full_url)

#         div_elements = await page.query_selector_all('div[style*="background-image"]')
#         for div in div_elements:
#             style_content = await div.get_attribute('style')
#             if 'background-image' in style_content:
#                 bg_url = style_content.split('url(')[-1].split(')')[0].replace('"', '').replace("'", "")
#                 full_bg_url = urljoin(url, bg_url)
#                 img_urls.add(full_bg_url)

#         await browser.close()
#     return img_urls

# def get_base_url(img_url):
#     parsed_url = urlparse(img_url)
#     base_url = urlunparse((parsed_url.scheme, parsed_url.netloc, '', '', '', ''))
#     return base_url

# async def download_image(session, img_url, download_folder):
#     logger.info(f"Attempting to download: {img_url}")
#     if 'javascript' in img_url:
#         logger.info(f"Image url: {img_url}, returning None as javascript is present in the url")
#         return None
#     if not os.path.exists(download_folder):
#         os.makedirs(download_folder)
    
#     try:
#         if img_url.startswith('data:image'):
#             header, encoded = img_url.split(',', 1)
#             format = header.split(';')[0].split('/')[1]
#             image_data = base64.b64decode(encoded)
#             image = Image.open(BytesIO(image_data))
            
#             if image.mode != 'RGB':
#                 image = image.convert('RGB')
            
#             file_extension = format.lower()
#         else:
#             page_url = get_base_url(img_url)
#             headers = {
#                 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
#                 'Referer': page_url
#             }
#             async with session.get(img_url, headers=headers, ssl=False) as response:
#                 if response.status == 200:
#                     image_bytes = await response.read()
#                     image = Image.open(BytesIO(image_bytes))
#                     file_extension = image.format.lower()
#                 else:
#                     logger.warning(f"Failed to download {img_url}: HTTP {response.status}")
#                     return None
        
#         img_filename = os.path.join(download_folder, f"{uuid.uuid4()}.{file_extension}")
#         image.save(img_filename)
#         logger.info(f"Downloaded image to {img_filename}")
#         return img_filename

#     except Exception as e:
#         logger.error(f"An error occurred while downloading the image: {e}")
#         return None
    
# async def download_images(url, download_folder='images'):
#     img_urls = await get_image_urls(url) 
#     if img_urls:
#         async with aiohttp.ClientSession() as session:
#             tasks = [download_image(session, img_url, download_folder) for img_url in img_urls]
#             filenames = await asyncio.gather(*tasks)
#             return [filename for filename in filenames if filename is not None]
#     else:
#         logger.warning("Failed to identify any image using headless browser, trying with non-headless browser.")
#         filenames = await download_images_non_headless_browser(url, download_folder)
#         return filenames


