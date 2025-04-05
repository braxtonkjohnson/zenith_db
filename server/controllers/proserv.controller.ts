import { RequestHandler } from 'express';
import Product from '../models/ProServ';

interface ProductItem {
  ProductName: string;
  Price: number;
  DistributorID: string;
  Nutrition?: any;
}

export const addProductsToVendor: RequestHandler = async (req, res) => {
  const { vendorID, classID, detailID, items }: {
    vendorID: string;
    classID: string;
    detailID: string;
    items: ProductItem[];
  } = req.body;

  try {
    const [sector, zip, vendorIndex, locationIndex] = vendorID.split('-');
    const basePath = `${zip}.${sector}.Vendors.${vendorIndex}.Locations.${locationIndex}.Products & Services.${classID}`;
    const detailPath = `${basePath}.Detail Classifiers.${detailID}.Items`;

    const itemBlock: Record<string, any> = {};

    items.forEach((item, i) => {
      const itemIndex = i.toString().padStart(4, '0');
      const fullZenithID = `${classID}-${detailID}-${item.DistributorID}-${vendorID}-${itemIndex}`;

      itemBlock[itemIndex] = {
        "Product Name": item.ProductName,
        "Price Per Unit": item.Price,
        "Distributor ID": item.DistributorID,
        "Zenith ID": fullZenithID,
        "Nutrition": item.Nutrition || {}
      };
    });

    const updateData = {
      [`${basePath}.Class Name`]: "", // optionally set later
      [`${basePath}.Detail Classifiers.${detailID}.Description`]: "", // optionally set later
      [detailPath]: itemBlock
    };

    const updateResult = await Product.updateOne(
      { [`${zip}.${sector}.Vendors.${vendorIndex}.Locations.${locationIndex}`]: { $exists: true } },
      { $set: updateData }
    );

    if (updateResult.modifiedCount === 0) {
      res.status(404).json({ message: "Vendor location not found." });
    } else {
      res.status(200).json({ message: "Products & Services added successfully." });
    }

  } catch (err) {
    console.error("Error adding products:", err);
    res.status(500).json({ error: "Failed to add products." });
  }
};


