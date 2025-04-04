from pymongo import MongoClient

client = MongoClient("mongodb+srv://indigo:indigo@cluster0.4addy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")


prod_db = client["zenith"]
dev_db = client["zenith_dev"]

collections = ["vendors", "zipcodes", "proserv"]

for col_name in collections:
    prod_col = prod_db[col_name]
    dev_col = dev_db[col_name]

    dev_col.drop()  # Start clean
    docs = list(prod_col.find())
    if docs:
        dev_col.insert_many(docs)
        print(f"✅ Cloned '{col_name}' ({len(docs)} docs) to 'zenith_dev'")
    else:
        print(f"⚠️  No documents found in '{col_name}' to clone.")
