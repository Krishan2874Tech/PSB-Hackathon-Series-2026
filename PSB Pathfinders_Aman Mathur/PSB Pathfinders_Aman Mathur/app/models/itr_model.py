from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base

class ITR(Base):
    __tablename__ = 'itr_records'

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey('users.id'))
    financial_year = Column(String(10))
    declared_income = Column(Float)
    tax_paid = Column(Float)
    deductions = Column(Float)
    refund_amount = Column(Float)
