import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import ProServ from '../models/ProServ';

dotenv.config();

async function importData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    // Read the JSON file
    const jsonPath = path.join(__dirname, '../../zenith_dev.vendors.json');
    console.log('Reading JSON file from:', jsonPath);
    
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log('JSON data loaded successfully');

    // Clear existing data
    console.log('Clearing existing data...');
    await ProServ.deleteMany({});
    console.log('Existing data cleared');

    // Transform and import data
    const products = [];
    
    Object.entries(jsonData[0]).forEach(([zipCode, zipData]: [string, any]) => {
      Object.entries(zipData).forEach(([sector, sectorData]: [string, any]) => {
        if (sectorData["Products & Services"]) {
          Object.entries(sectorData["Products & Services"]).forEach(([classId, classData]: [string, any]) => {
            Object.entries(classData["Detail Classifiers"]).forEach(([detailId, detailData]: [string, any]) => {
              Object.entries(detailData.Items).forEach(([itemId, itemData]: [string, any]) => {
                products.push({
                  ProductName: itemData["Product Name"],
                  Price: itemData["Price Per Unit"],
                  ClassID: classId,
                  DetailID: detailId,
                  DistributorID: itemData["Distributor ID"] || "",
                  VendorID: itemData["VendorID"] || `${sector}-${zipCode}-${itemData["VendorID"] || "000000"}-00`,
                  Nutrition: itemData.Nutrition || {}
                });
              });
            });
          });
        }
      });
    });

    console.log(`Importing ${products.length} products...`);
    await ProServ.insertMany(products);
    console.log('Data import completed successfully');

  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

importData(); 