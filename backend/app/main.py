from fastapi import FastAPI
from app.routers import auth, users, expenses
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(title="Expense Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(expenses.router)

@app.get("/")
def root():
    return {"message": "Expense Tracker API Running"}
