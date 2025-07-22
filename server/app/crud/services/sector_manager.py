from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os

uri = ( "mongodb+srv://indigo:indigo@cluster0.4addy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
client = MongoClient(uri, server_api=ServerApi('1'))

db = client["zenith_dev"]

def initialize_sector_data():
    sectors = db["sectors"]
    sectors.drop() 
    sector_data = {
    "AF": "Alcohol-focused vendors (bars, liquor stores, wineries, breweries)",
    "AP": "Appliances & electronics repair",
    "AT": "Auto services (mechanics, tire shops, car washes)",
    "CL": "Clothing & Apparel Stores",
    "CN": "Cleaning Services",
    "ED": "Education & Tutoring",
    "EI": "Schools & Educational Institutions",
    "EL": "Electronics & Tech Retail",
    "EN": "Entertainment venues (theaters, arcades, bowling alleys)",
    "EV": "Event services (weddings, party planners, DJs, AV rentals)",
    "FT": "Fitness & Training (gyms, studios, trainers)",
    "GM": "General Merchandise (Walmart, Target, dollar stores)",
    "GR": "Grocery Stores, Markets, Bodegas",
    "GS": "Gas Stations",
    "GV": "Government Offices & Services",
    "HC": "Healthcare (urgent care, clinics, dentists, optometrists)",
    "HM": "Home Improvement & Hardware",
    "IN": "Insurance & Consulting",
    "LG": "Legal & Financial Services",
    "NB": "Nonprofits & Community Services",
    "PS": "Personal Services (barbers, nails, salons, massage)",
    "RE": "Recreation (golf courses, climbing centers)",
    "RS": "Restaurants, Cafes, Coffee Shops, Confectionary, Dessert Shops",
    "SP": "Specialty Retail (books, games, hobby shops, etc.)",
    "ST": "Storage & Moving",
    "TR": "Transportation Services (bike shops, car rental, ride share hubs)"
}

    # Insert as key-value pairs with sector code as document _id
    for code, classification in sector_data.items():
        sectors.insert_one({
            "_id": code,
            "Sector Classification": classification
        })

    print("✅ Sector definitions inserted (minimal format)")

def get_sector_description(sector_code):
    sector = sectors.find_one({"_id": sector_code})
    return sector["Sector Classification"] if sector else None

def sector_exists(sector_code):
    return sectors.find_one({"_id": sector_code}) is not None

def create_sector(sector_code, description):
    if not sector_exists(sector_code):
        sectors.insert_one({
            "_id": sector_code,
            "Sector Classification": description
        })
        return True
    return False

def insert_bulk_sector_definitions(definitions_dict):
    for code, description in definitions_dict.items():
        create_sector(code, description)
