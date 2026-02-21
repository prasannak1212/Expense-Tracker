from fastapi import APIRouter, Depends
from datetime import datetime
from app.schemas.expense import ExpenseCreate
from app.core.dependencies import get_current_user
from app.db.database import get_database

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.post("/")
def create_expense(
    expense: ExpenseCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()

    expense_data = expense.dict()
    expense_data.update({
        "user_email": current_user["email"],
        "created_at": datetime.utcnow()
    })

    db.expenses.insert_one(expense_data)

    return {"message": "Expense created successfully"}


@router.get("/")
def get_my_expenses(current_user: dict = Depends(get_current_user)):
    db = get_database()

    expenses = list(
        db.expenses.find(
            {"user_email": current_user["email"]},
            {"_id": 0}
        )
    )

    return expenses