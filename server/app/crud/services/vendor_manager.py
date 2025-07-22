from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
import os

uri = ( "mongodb+srv://indigo:indigo@cluster0.4addy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
client = MongoClient(uri, server_api=ServerApi('1'))

db = client["zenith_dev"]
vendors = db["vendors"]
zipcodes = db["zipcodes"]

def vendor_create_or_extend(sector_code, zip_code, business_data, location_data, reuse_vendor_index=None):
    sectors = db["sectors"]

    sector_doc = sectors.find_one({"_id": sector_code})
    if not sector_doc:
        raise ValueError(f"Sector '{sector_code}' not found.")

    parent_doc = vendors.find_one({zip_code: {"$exists": True}})
    if not parent_doc:
        raise ValueError(f"Zip code {zip_code} not found.")

    parent_id = parent_doc["_id"]
    zip_node = parent_doc[zip_code]

    # Initialize sector node if needed
    if sector_code not in zip_node:
        zip_node[sector_code] = {
            "Sector Classification": sector_doc["Sector Classification"],
            "Vendors": {}
        }

    vendors_dict = zip_node[sector_code]["Vendors"]

    # Determine if new vendor or extending existing
    if reuse_vendor_index is not None and reuse_vendor_index in vendors_dict:
        vendor = vendors_dict[reuse_vendor_index]
        location_index = str(len(vendor["Locations"])).zfill(2)
    else:
        reuse_vendor_index = str(len(vendors_dict)).zfill(6)
        location_index = "00"
        vendor = {
            "Business Name": business_data["Business Name"],
            "Legal Entity": business_data["Legal Entity"],
            "Registered EIN": business_data["Registered EIN"],
            "Locations": {}
        }

    vendor_id = f"{sector_code}-{zip_code}-{reuse_vendor_index}-{location_index}"

    # Insert new location
    vendor["Locations"][location_index] = {
        "Address": location_data["Address"],
        "Phone": location_data["Phone"],
        "Open Hours": location_data["Open Hours"],
        "VendorID": vendor_id
    }

    # Save changes
    vendors_dict[reuse_vendor_index] = vendor
    zip_node[sector_code]["Vendors"] = vendors_dict
    vendors.update_one({"_id": ObjectId(parent_id)}, {"$set": {zip_code: zip_node}})

    return vendor_id

vendor_create_or_extend(
    sector_code="AF",
    zip_code="46204",
    business_data={
        "Business Name": "Hovito Lounge",
        "Legal Entity": "Hovito LLC",
        "Registered EIN": "NA"
    },
    location_data={
        "Address": "101 Meridian Road.",
        "Phone": "18003334442",
        "Open Hours": "9PM-4AM"
    },
    reuse_vendor_index=None  # adds a new location to an existing vendor
)


