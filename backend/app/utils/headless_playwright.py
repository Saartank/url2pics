import asyncio
import os
import uuid
from urllib.parse import urljoin

from playwright.async_api import async_playwright

from ..logging_config import logger


async def download_images_non_headless_browser(url, download_folder='images'):
    """
    Parses the webpage at the given URL using Playwright, scrolling through the page slowly to ensure 
    all lazily rendered images are fully loaded. This function searches for image URLs by identifying 
    specific elements and tags relevant to images. After collecting the URLs, Playwright navigates to 
    each image URL and downloads the image into the specified download folder.

    Args:
        url (str): The URL of the webpage to parse.
        download_folder (str): The path to the folder where images will be saved.

    Returns:
        list: A list of filenames for the images that were successfully downloaded to the download folder.
    """

    logger.info(f"Starting to scrape url: {url}")
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()

        try:
            await page.goto(url, wait_until="networkidle", timeout=3000)
        except TimeoutError:
            logger.warning("Network idle timeout after 3 seconds. Continuing with processing.")
        except Exception as e:
            logger.warning(f"Failed to load page: {e}")
            logger.warning("Continuing with processing.")
            
        
        last_position = await page.evaluate('window.scrollY')
        while True:
            await page.evaluate("window.scrollBy(0, window.innerHeight)")
            await page.wait_for_timeout(600)
            current_position = await page.evaluate('window.scrollY')
            if current_position == last_position:
                break
            last_position = current_position
        
        img_elements = await page.query_selector_all('img')
        img_urls = set()
        for img in img_elements:
            src = await img.get_attribute('src') or \
                  await img.get_attribute('data-src') or \
                  await img.get_attribute('data-lazy-src') or \
                  await img.get_attribute('data-srcset') or \
                  await img.get_attribute('srcset') or \
                  await img.get_attribute('data-original')
            if src:
                full_url = urljoin(url, src.split()[0])
                img_urls.add(full_url)
                logger.info(f"Identified image url: {full_url}")

        div_elements = await page.query_selector_all('div[style*="background-image"]')
        for div in div_elements:
            style_content = await div.get_attribute('style')
            if 'background-image' in style_content:
                bg_url = style_content.split('url(')[-1].split(')')[0].replace('"', '').replace("'", "")
                full_bg_url = urljoin(url, bg_url)
                img_urls.add(full_bg_url)
                logger.info(f"Identified image url: {full_bg_url}")

        picture_elements = await page.query_selector_all('picture')
        for picture in picture_elements:
            sources = await picture.query_selector_all('source')
            for source in sources:
                srcset = await source.get_attribute('srcset')
                if srcset:
                    first_src = srcset.split(',')[0].strip().split()[0]
                    full_url = urljoin(url, first_src)
                    img_urls.add(full_url)
                    logger.info(f"Fetched url: {full_url}")

        logger.info("Attepting to downlaod the images in browser now: ")

        img_filenames = []
        
        for img_url in img_urls:
            try:
                response = await page.goto(img_url, wait_until="networkidle")
                if response.ok:
                    content = await response.body()

                    common_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.webp']
                    ext = None

                    for extension in common_extensions:
                        if extension in img_url.lower():
                            ext_position = img_url.lower().rfind(extension)
                            ext = img_url[ext_position:ext_position + len(extension)]
                            break

                    if ext:
                        unique_filename = str(uuid.uuid4())
                        file_path = os.path.join(download_folder, f"{unique_filename}{ext}")

                        with open(file_path, "wb") as file:
                            file.write(content)
                        logger.info(f'Image saved as: {file_path}')
                        img_filenames.append(file_path)
                    else:
                        logger.warning(f"No valid extension found for URL: {img_url}, skipping download.")

            except Exception as e:
                logger.warning(f"Failed to process image from {img_url}: {e}")

        await browser.close()
    return img_filenames


if __name__ == '__main__':
    url = "https://www.ford.com/"
    asyncio.run(download_images_non_headless_browser(url))