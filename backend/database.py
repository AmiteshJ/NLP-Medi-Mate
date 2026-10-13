"""
Minimal SQLite persistence for the History page. Deliberately simple --
no auth, no ORM -- in line with the spec ("Do NOT over-engineer
authentication. Local storage or a simple database is sufficient.").
"""
import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "medimate.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS consultations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            user_input TEXT NOT NULL,
            symptoms TEXT NOT NULL,
            intent TEXT,
            reply TEXT
        )
    """)
    conn.commit()
    conn.close()


def save_consultation(user_input, symptoms, intent, reply):
    conn = get_connection()
    conn.execute(
        "INSERT INTO consultations (created_at, user_input, symptoms, intent, reply) VALUES (?, ?, ?, ?, ?)",
        (datetime.now().isoformat(), user_input, json.dumps(symptoms), intent, reply),
    )
    conn.commit()
    conn.close()


def list_consultations(limit=50):
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM consultations ORDER BY id DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()
    result = []
    for row in rows:
        result.append({
            "id": row["id"],
            "created_at": row["created_at"],
            "user_input": row["user_input"],
            "symptoms": json.loads(row["symptoms"]),
            "intent": row["intent"],
            "reply": row["reply"],
        })
    return result
