from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserOutput, UserCreate


router = APIRouter(prefix="/users", tags=["users"])

@router.post("", response_model=UserOutput, status_code=status.HTTP_201_CREATED)
async def create_user(new_user: UserCreate, db: AsyncSession = Depends(get_db)):
    user_with_same_email_exists = await db.execute(select(User).where( User.email == new_user.email))
    if user_with_same_email_exists.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email already exists")

    user = User(email=new_user.email)
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return user

@router.get("", response_model=list[UserOutput])
async def list_users(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).order_by(User.id))
    return list(res.scalars().all())