from pydantic import BaseModel, Field
from datetime import datetime

class ExpenseCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    category: str = Field(min_length=1, max_length=50)

class ExpenseResponse(BaseModel):
    title: str
    amount: float
    category: str
    created_at: datetime