from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload

from .. import database, models
from ..authentication import oauth2
from ..logging_config import logger
from ..schemas.misc_schema import UrlData, UrlList
from ..schemas.query_schema import QuerySchema, QueryThumbnailSchema
from ..schemas.user_schema import UserRead
from ..utils.aws_utils import download_and_upload_images
from ..utils.misc import check_playwright

router = APIRouter(
    prefix="/query",
    tags=['Image Scrapping APIs']
)

@router.get("/validate-playwright")
async def validate_playwright():
    result = await check_playwright()
    return {
        "msg": result,
    }

@router.post("/", response_model=QuerySchema)
async def scrape_url_for_images(
    data: UrlData, 
    db: AsyncSession = Depends(database.get_db), 
    current_user: UserRead = Depends(oauth2.get_current_user)
):
    image_results = await download_and_upload_images(data.url)

    new_query = models.Queries(
        url=data.url,
        user_id=current_user.uuid
    )

    db.add(new_query)
    await db.flush()
    for image_result in image_results:
        if image_result and 'url' in image_result:
            new_image = models.Images(
                url=image_result['url'],
                height=image_result['height'],
                width=image_result['width'],
                extension=image_result['extension'],
                query_id=new_query.id
            )
            db.add(new_image)

    await db.commit()
    await db.refresh(new_query, attribute_names=['images'])
    
    return new_query

@router.get("/all", response_model=List[QueryThumbnailSchema])
async def get_all_queries(
    db: AsyncSession = Depends(database.get_db), 
    current_user: UserRead = Depends(oauth2.get_current_user)
):

    result = await db.execute(
        select(models.Queries)
        .filter(models.Queries.user_id == current_user.uuid)
        .order_by(desc(models.Queries.created_at))
    )
    queries = result.scalars().all()

    return queries

@router.get("/{query_id}", response_model=QuerySchema)
async def get_query(
    query_id: int, 
    db: AsyncSession = Depends(database.get_db), 
    current_user: UserRead = Depends(oauth2.get_current_user)
):
    result = await db.execute(
        select(models.Queries)
        .options(joinedload(models.Queries.images))
        .filter(models.Queries.id == query_id)
        .filter(models.Queries.user_id == current_user.uuid)
    )
    query = result.scalars().first()

    if query is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Query not found"
        )

    return query

@router.delete("/{query_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_query(
    query_id: int, 
    db: AsyncSession = Depends(database.get_db), 
    current_user: UserRead = Depends(oauth2.get_current_user)
):
    result = await db.execute(
        select(models.Queries)
        .filter(models.Queries.id == query_id)
        .filter(models.Queries.user_id == current_user.uuid)
    )
    query = result.scalars().first()

    if query is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Query not found"
        )

    await db.delete(query)
    await db.commit()

    return {"message": "Query deleted successfully"}