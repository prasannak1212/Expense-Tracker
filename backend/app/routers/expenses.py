from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.core.dependencies import get_current_user
from app.db.database import get_database

router = APIRouter(prefix="/expenses", tags=["expenses"])


def serialize_expense(expense):
    return {
        "id": str(expense["_id"]),
        "title": expense["title"],
        "amount": expense["amount"],
        "category": expense["category"],
        "created_at": expense["created_at"],
    }


@router.post("/", response_model=dict)
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

    result = db.expenses.insert_one(expense_data)

    return {"id": str(result.inserted_id)}


@router.get("/", response_model=list[ExpenseResponse])
def get_my_expenses(current_user: dict = Depends(get_current_user)):
    db = get_database()

    expenses = db.expenses.find({"user_email": current_user["email"]})

    return [serialize_expense(exp) for exp in expenses]


@router.put("/{expense_id}")
def update_expense(
    expense_id: str,
    expense: ExpenseUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()

    existing = db.expenses.find_one({"_id": ObjectId(expense_id)})

    if not existing:
        raise HTTPException(status_code=404, detail="Expense not found")

    if existing["user_email"] != current_user["email"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = {k: v for k, v in expense.dict().items() if v is not None}

    db.expenses.update_one(
        {"_id": ObjectId(expense_id)},
        {"$set": update_data}
    )

    return {"message": "Expense updated successfully"}


@router.delete("/{expense_id}")
def delete_expense(
    expense_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()

    existing = db.expenses.find_one({"_id": ObjectId(expense_id)})

    if not existing:
        raise HTTPException(status_code=404, detail="Expense not found")

    if existing["user_email"] != current_user["email"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.expenses.delete_one({"_id": ObjectId(expense_id)})

    return {"message": "Expense deleted successfully"}