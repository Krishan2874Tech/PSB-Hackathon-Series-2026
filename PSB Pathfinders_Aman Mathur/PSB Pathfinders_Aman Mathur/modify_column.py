from app.database import engine
from sqlalchemy import text

def update_db():
    with engine.connect() as conn:
        print("Modifying users table...")
        try:
            conn.execute(text('ALTER TABLE users MODIFY COLUMN last_device_id VARCHAR(255)'))
            conn.commit()
            print("last_device_id modified successfully.")
        except Exception as e: print(f"Error: {e}")

if __name__ == "__main__":
    update_db()
