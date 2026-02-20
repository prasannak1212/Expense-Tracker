from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user import UserRegister, UserLogin, Token
from app.core.security import hash_password, verify_password, create_access_token
from app.db.database import get_database

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(user: UserRegister):
    db = get_database()

    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)

    db.users.insert_one({
        "email": user.email,
        "password": hashed_password
    })

    return {"message": "User registered successfully"}

from fastapi.security import OAuth2PasswordRequestForm
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_database()

    db_user = db.users.find_one({"email": form_data.username})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(form_data.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token({"sub": db_user["email"]})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }