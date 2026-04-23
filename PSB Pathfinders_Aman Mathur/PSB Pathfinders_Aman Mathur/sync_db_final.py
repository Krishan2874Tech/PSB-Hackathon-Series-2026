from app.database import engine
from sqlalchemy import text

def sync_all_tables():
    with engine.connect() as conn:
        print("Starting comprehensive database sync...")
        
        # 1. Sync 'users'
        print("Checking 'users' table...")
        cols_users = {
            "mobile": "VARCHAR(15) UNIQUE",
            "dob": "VARCHAR(20)",
            "pan_number": "VARCHAR(10) UNIQUE",
            "last_device_id": "VARCHAR(255)",
            "otp_request_count": "INT DEFAULT 0",
            "last_otp_request_time": "DATETIME",
            "blocked_until": "DATETIME"
        }
        for col, spec in cols_users.items():
            try:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} {spec}"))
                print(f"Added {col} to users.")
            except: pass

        # 2. Sync 'transactions'
        print("Checking 'transactions' table...")
        try:
            conn.execute(text("ALTER TABLE transactions ADD COLUMN account_id INT"))
            conn.execute(text("ALTER TABLE transactions ADD CONSTRAINT fk_txn_acc FOREIGN KEY (account_id) REFERENCES accounts(id)"))
        except: pass
        try:
            conn.execute(text("ALTER TABLE transactions ADD COLUMN category VARCHAR(100)"))
        except: pass
        try:
            conn.execute(text("ALTER TABLE transactions DROP COLUMN user_id"))
        except: pass

        # 3. Sync 'investments'
        print("Checking 'investments' table...")
        try:
            conn.execute(text("ALTER TABLE investments ADD COLUMN customer_id INT"))
            conn.execute(text("ALTER TABLE investments ADD CONSTRAINT fk_inv_user FOREIGN KEY (customer_id) REFERENCES users(id)"))
        except: pass
        cols_inv = {
            "instrument_name": "VARCHAR(255)",
            "units": "FLOAT",
            "current_price": "FLOAT",
            "purchase_price": "FLOAT",
            "date": "DATETIME"
        }
        for col, spec in cols_inv.items():
            try:
                conn.execute(text(f"ALTER TABLE investments ADD COLUMN {col} {spec}"))
            except: pass
        try:
            conn.execute(text("ALTER TABLE investments DROP COLUMN user_id"))
            conn.execute(text("ALTER TABLE investments DROP COLUMN name"))
            conn.execute(text("ALTER TABLE investments DROP COLUMN amount"))
        except: pass

        # 4. Create missing tables (Account, ITR, Market)
        print("Ensuring new tables exist...")
        from app.database import Base
        from app.models import account_model, itr_model, market_model, action_log_model
        Base.metadata.create_all(bind=engine)

        conn.commit()
        print("Sync complete.")

if __name__ == "__main__":
    sync_all_tables()
