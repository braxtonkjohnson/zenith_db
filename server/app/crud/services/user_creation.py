from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
import os

uri = ( "mongodb+srv://indigo:indigo@cluster0.4addy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["zenith_dev"]
users = db["users"]

def create_user(name: str, age: int, job: str):
    if users.find_one({"Name": name}):
        raise ValueError(f"User '{name}' already exists.")

    user_obj = {
        "Name": name,
        "Age": age,
        "Job": job,
        "Transactions": {}
    }

    users.insert_one(user_obj)
    return f"User '{name}' created successfully."

create_user("Shelby Conn", 20, "Host")