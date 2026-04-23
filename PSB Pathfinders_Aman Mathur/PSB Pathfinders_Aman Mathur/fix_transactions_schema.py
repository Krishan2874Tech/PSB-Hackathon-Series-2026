from app.database import engine
from sqlalchemy import text

def update_transactions_table():
    with engine.connect() as conn:
        print("Updating transactions table schema...")
        
        # 1. Add account_id
        try:
            conn.execute(text('ALTER TABLE transactions ADD COLUMN account_id INT'))
            conn.execute(text('ALTER TABLE transactions ADD CONSTRAINT fk_transactions_account FOREIGN KEY (account_id) REFERENCES accounts(id)'))
            print("Added account_id and foreign key.")
        except Exception as e: print(f"Note (account_id): {e}")
        
        # 2. Add category
        try:
            conn.execute(text('ALTER TABLE transactions ADD COLUMN category VARCHAR(100)'))
            print("Added category column.")
        except Exception as e: print(f"Note (category): {e}")
        
        # 3. Remove old user_id if it exists
        try:
            conn.execute(text('ALTER TABLE transactions DROP FOREIGN KEY transactions_ibfk_1')) # Attempt to drop default FK
        except: pass
        
        try:
            conn.execute(text('ALTER TABLE transactions DROP COLUMN user_id'))
            print("Removed obsolete user_id column.")
        except Exception as e: print(f"Note (user_id): {e}")
        
        conn.commit()
        print("Transactions table update finished.")

if __name__ == "__main__":
    update_transactions_table()
