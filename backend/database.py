import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Update with actual Oracle DB credentials
# The format for oracledb is: oracle+oracledb://user:password@host:port/?service_name=service
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Oracle uses a specific dialect and might need Thick mode depending on features, 
# but thin mode is usually sufficient for standard operations.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    # echo=True # Uncomment for SQL logging
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()