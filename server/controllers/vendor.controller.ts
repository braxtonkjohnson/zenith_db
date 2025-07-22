import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Vendor from '../models/Vendor';
import Sector from '../models/Sector';
import VendorUser from '../models/VendorUser';

export const createVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    zipCode,
    sector,
    businessName,
    legalEntity,
    registeredEIN,
    address,
    phone,
    openHours,
    user
  } = req.body;

  console.log("Incoming request body:", req.body);

  if (!user || !user.username) {
    res.status(400).json({ error: "User information is missing." });
    return;
  }

  try {
    const sectorDoc = await Sector.findOne({ _id: sector });
    if (!sectorDoc) {
      res.status(400).json({ error: `Sector '${sector}' not found.` });
      return;
    }

    const vendorDoc = await Vendor.findOne({ [zipCode]: { $exists: true } });
    if (!vendorDoc) {
      res.status(400).json({ error: `Zip code ${zipCode} not found.` });
      return;
    }

    const parentId: mongoose.Types.ObjectId = vendorDoc._id as mongoose.Types.ObjectId;
    const fullDoc = vendorDoc.toObject() as Record<string, any>;
    const zipNode = fullDoc[zipCode] || {};

    if (!zipNode[sector]) {
      zipNode[sector] = {
        "Sector Classification": sectorDoc.SectorClassification,
        "Vendors": {}
      };
    }

    const vendorsDict = zipNode[sector]["Vendors"] || {};
    const newVendorIndex = Object.keys(vendorsDict).length.toString().padStart(6, '0');
    const locationIndex = "00";
    const vendorID = `${sector}-${zipCode}-${newVendorIndex}-${locationIndex}`;

    const newVendor = {
      "Business Name": businessName,
      "Legal Entity": legalEntity,
      "Registered EIN": registeredEIN,
      "Locations": {
        [locationIndex]: {
          "Address": address,
          "Phone": phone,
          "Open Hours": openHours,
          "VendorID": vendorID
        }
      },
      "Users": {
        [user.username]: {
          Name: user.name,
          Title: user.title,
          Username: user.username
        }
      }
    };

    vendorsDict[newVendorIndex] = newVendor;
    zipNode[sector]["Vendors"] = vendorsDict;

    const updateResult = await Vendor.collection.updateOne(
      { _id: parentId },
      { $set: { [zipCode]: zipNode } },
      { upsert: false }
    );

    if (updateResult.modifiedCount === 0) {
      console.warn("No document was modified. Check if _id exists and zipNode has data.");
    }

    await VendorUser.collection.updateOne(
      { Username: user.username },
      {
        $set: {
          Username: user.username,
          Password: user.password,
          Name: user.name,
          Title: user.title,
          AuthorizedVendorID: vendorID
        }
      },
      { upsert: true }
    );

    res.status(201).json({ vendorID });
  } catch (err) {
    console.error("Vendor creation error:", err);
    res.status(500).json({ error: "Error creating vendor." });
  }
};

// --- Efficient GET /:vendorID handler ---
export const getVendorByID = async (req: Request, res: Response): Promise<void> => {
  const { vendorID } = req.params;

  try {
    const [sector, zipCode, vendorIndex] = vendorID.split("-");
    const vendorDoc = await Vendor.findOne({ [zipCode]: { $exists: true } });

    if (!vendorDoc) {
      res.status(404).json({ error: "Vendor document not found for zip code." });
      return;
    }

    const doc = vendorDoc.toObject() as Record<string, any>;
    const vendorData = doc?.[zipCode]?.[sector]?.["Vendors"]?.[vendorIndex];

    if (!vendorData) {
      res.status(404).json({ error: "Vendor not found at specified path." });
      return;
    }

    res.status(200).json(vendorData);
  } catch (err) {
    console.error("Error fetching vendor by ID:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};









  





  



  





  
