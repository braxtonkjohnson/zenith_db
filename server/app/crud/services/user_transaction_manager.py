from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
import os
from datetime import datetime

uri = ( "mongodb+srv://indigo:indigo@cluster0.4addy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
client = MongoClient(uri, server_api=ServerApi('1'))

db= client["zenith_dev"]
users = db["users"]
vendors = db["vendors"]
proserv = db["proserv"]

def record_transaction(user_name, zenith_items):
    """
    Records a transaction for a user given a list of dicts with ZenithID, VendorID, and Quantity.
    """
    user_doc = users.find_one({"Name": user_name})
    if not user_doc:
        raise ValueError(f"User '{user_name}' not found.")

    transactions = user_doc.get("Transactions", {})
    next_index = str(len(transactions))

    transaction_data = {}
    total_amount = 0.0
    vendor_id = zenith_items[0]["VendorID"]
    sector, zip_code, vendor_index, location_index = vendor_id.split("-")

    vendor_data = vendors.find_one({}, {zip_code: 1})
    vendor_node = vendor_data[zip_code][sector]["Vendors"][vendor_index]["Locations"][location_index]
    business_name = vendor_data[zip_code][sector]["Vendors"][vendor_index]["Business Name"]
    tax_id = f"TX-0000-GV-{zip_code}-000000-00"

    for i, item_info in enumerate(zenith_items):
        zenith_id = item_info["ZenithID"]
        quantity = item_info["Quantity"]
        class_id, detail_id, *_vendor_parts, item_index = zenith_id.split("-")

        item = vendor_node["Products & Services"][class_id]["Detail Classifiers"][detail_id]["Items"][item_index]
        price = item["Price Per Unit"]
        amount = price * quantity
        total_amount += amount

        transaction_data[str(i)] = {
            "Item": item["Product Name"],
            "Quantity": quantity,
            "Units": None,
            "ZenithID": zenith_id,
            "Amount": round(amount, 2)
        }

    transaction_record = {
        "Vendor ID": vendor_id,
        "Vendor Name": business_name,
        "Tax ID": tax_id,
        "Total Transaction Amount": round(total_amount, 2),
        "Transaction Date": datetime.now().strftime("%m%d%Y"),
        "Transaction Data": transaction_data
    }

    transactions[next_index] = transaction_record

    users.update_one(
        {"_id": user_doc["_id"]},
        {"$set": {"Transactions": transactions}}
    )

    return transaction_record

record_transaction(
    "Alex Grant",
    [
        {
            "ZenithID": "FB-0034-FD-46166-000000-00-0000"   ,
            "VendorID": "RS-46204-000000-00" ,
            "Quantity": 1
        },

        {
            "ZenithID": "FB-0020-FD-46166-000000-00-0000",
            "VendorID": "RS-46204-000000-00" ,
            "Quantity": 2,
        }
    ]
)

