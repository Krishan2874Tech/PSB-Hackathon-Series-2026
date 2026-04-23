from app.database import engine
from sqlalchemy import text

def update_db():
    with engine.connect() as conn:
        print("Updating users table...")
        try:
            conn.execute(text('ALTER TABLE users ADD COLUMN last_device_id VARCHAR(100)'))
        except Exception as e: print(f"Note: {e}")
        
        try:
            conn.execute(text('ALTER TABLE users ADD COLUMN otp_request_count INT DEFAULT 0'))
        except Exception as e: print(f"Note: {e}")
        
        try:
            conn.execute(text('ALTER TABLE users ADD COLUMN last_otp_request_time DATETIME'))
        except Exception as e: print(f"Note: {e}")
        
        print("Updating action_logs table...")
        try:
            conn.execute(text('ALTER TABLE action_logs ADD COLUMN status VARCHAR(50) DEFAULT "Completed"'))
        except Exception as e: print(f"Note: {e}")
        
        conn.commit()
        print("Database update attempt finished.")

if __name__ == "__main__":
    update_db()
