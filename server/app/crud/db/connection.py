from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os

def get_db():
    uri = ( "mongodb+srv://indigo:indigo@cluster0.4addy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client["zenith"]
    return db

