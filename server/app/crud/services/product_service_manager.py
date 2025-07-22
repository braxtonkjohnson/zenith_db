from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
import os

uri = ( "mongodb+srv://indigo:indigo@cluster0.4addy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["zenith_dev"]
vendors = db["vendors"]
proserv = db["proserv"]

def add_product(zip_code, sector_code, vendor_index, location_index, class_id, detail_id, item_data):
    # Grab the vendor doc
    vendor_doc = vendors.find_one({zip_code: {"$exists": True}})
    if not vendor_doc:
        raise ValueError(f"Zip code {zip_code} not found.")

    vendor_branch = vendor_doc[zip_code][sector_code]["Vendors"][vendor_index]
    location = vendor_branch["Locations"][location_index]

    # Init Products & Services if needed
    if "Products & Services" not in location:
        location["Products & Services"] = {}

    ps_block = location["Products & Services"]

    # Get ProServ data from shared document
    proserv_doc = proserv.find_one()
    if not proserv_doc or class_id not in proserv_doc:
        raise ValueError(f"Class ID '{class_id}' not found in ProServ.")

    class_data = proserv_doc[class_id]

    # Init Class
    if class_id not in ps_block:
        ps_block[class_id] = {
            "Class Name": class_data["Class Name"],
            "Detail Classifiers": {}
        }

    class_block = ps_block[class_id]["Detail Classifiers"]

    # Init Detail Classifier
    if detail_id not in class_data["Detail Classifiers"]:
        raise ValueError(f"Detail ID '{detail_id}' not found for class '{class_id}'.")

    if detail_id not in class_block:
        class_block[detail_id] = {
            "Description": class_data["Detail Classifiers"][detail_id]["Description"],
            "Items": {}
        }

    items = class_block[detail_id]["Items"]
    new_index = str(len(items)).zfill(4)

    distributor_id = item_data["Distributor ID"]
    zenith_id = f"{class_id}-{detail_id}-{distributor_id}-{new_index}"

    items[new_index] = {
        "Product Name": item_data["Product Name"],
        "Price Per Unit": item_data["Price Per Unit"],
        "Distributor ID": distributor_id,
        "Zenith ID": zenith_id,
        "Nutrition": item_data.get("Nutrition", {})
    }

    # Push update
    parent_id = vendor_doc["_id"]
    vendors.update_one(
        {"_id": ObjectId(parent_id)},
        {"$set": {f"{zip_code}.{sector_code}.Vendors.{vendor_index}.Locations.{location_index}.Products & Services": ps_block}}
    )

    return zenith_id

zenith_id = add_product(
    zip_code="00602",
    sector_code="EL",
    vendor_index="000010",
    location_index="00",
    class_id="OF",
    detail_id="0000",
    item_data={
        "Product Name": "Softmax Pens",
        "Price Per Unit": 5,
        "Distributor ID": ""
    }
)
