from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId

uri = ( "mongodb+srv://indigo:indigo@cluster0.4addy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["zenith_dev"]

