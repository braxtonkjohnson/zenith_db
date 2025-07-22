from fastapi import FastAPI 
from app.routes import vendors 

app = FastAPI()
app.include_router(vendors.router, prefix="/api/vendors")