from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str

class UserOutput(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True