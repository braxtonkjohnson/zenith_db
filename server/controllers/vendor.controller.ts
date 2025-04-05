import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Vendor from '../models/Vendor';
import Sector from '../models/Sector';

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
  } = req.body;

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

    const parentId = vendorDoc._id;
    const zipNode = vendorDoc.get(zipCode) || {};

    if (!zipNode[sector]) {
      zipNode[sector] = {
        "Sector Classification": sectorDoc.SectorClassification,
        "Vendors": {}
      };
    }

    const vendorsDict = zipNode[sector]["Vendors"];
    const newVendorIndex = Object.keys(vendorsDict || {}).length.toString().padStart(6, '0');
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
      }
    };

    vendorsDict[newVendorIndex] = newVendor;
    zipNode[sector]["Vendors"] = vendorsDict;

    console.log("Attempting update on:", parentId);
    console.log("Setting path:", zipCode);
    console.log("Zip Node Sample:", JSON.stringify(zipNode, null, 2));


    const updateResult = await Vendor.collection.updateOne(
      { [`${zipCode}.${sector}`]: { $exists: true} },
      { $set: { [zipCode]: zipNode } },
      {upsert: true}
    );
    console.log("Update Result:", updateResult);
    if (updateResult.modifiedCount === 0) {
        console.warn("No document was modified. Check if _id exists and zipNode has data.")
    }

    res.status(201).json({ vendorID });
  } catch (err) {
    console.error("Vendor creation error:", err);
    res.status(500).json({ error: "Error creating vendor." });
  }
};



  





  
