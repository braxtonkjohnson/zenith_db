// fixAuthorizedVendorID.js
const { MongoClient } = require("mongodb");

// 🔐 Replace with your actual MongoDB URI
const uri = "mongodb+srv://indigo:indigo@cluster0.4addy.mongodb.net/zenith_dev?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("zenith_dev"); // Change to your DB name
    const collection = db.collection("vendor_users");

    const result = await collection.updateMany(
      { "Authorized VendorID": { $exists: true } },
      [
        {
          $set: {
            AuthorizedVendorID: "$Authorized VendorID",
          },
        },
        {
          $unset: "Authorized VendorID",
        },
      ]
    );

    console.log(`✅ Updated ${result.modifiedCount} documents.`);
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await client.close();
  }
}

run();
