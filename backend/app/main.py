from fastapi import FastAPI
from app.routers import auth, users

app = FastAPI(title="Expense Tracker API")

app.include_router(auth.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "Expense Tracker API Running"}
