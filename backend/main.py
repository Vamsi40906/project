# backend/main.py
import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"],
                   allow_methods=["*"], allow_headers=["*"])

def get_db():
    conn = sqlite3.connect("app.db")
    conn.row_factory = sqlite3.Row
    return conn

with get_db() as db:
    db.execute("""CREATE TABLE IF NOT EXISTS expenses(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT, amount REAL, category TEXT, date TEXT)""")

class Expense(BaseModel):
    title: str
    amount: float
    category: str
    date: str

@app.get("/expenses")
def list_expenses():
    with get_db() as db:
        return [dict(r) for r in db.execute("SELECT * FROM expenses")]

@app.post("/expenses")
def add_expense(e: Expense):
    with get_db() as db:
        db.execute("INSERT INTO expenses(title,amount,category,date) VALUES(?,?,?,?)",
                   (e.title, e.amount, e.category, e.date))
    return {"message": "added"}

@app.delete("/expenses/{id}")
def delete_expense(id: int):
    with get_db() as db:
        db.execute("DELETE FROM expenses WHERE id=?", (id,))
    return {"message": "deleted"}