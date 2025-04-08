import { RequestHandler } from 'express';
import Product from '../models/ProServ';
import Vendor from '../models/Vendor';

export const addProductsToVendor: RequestHandler = async (req, res) => {
  const { vendorID, classID, detailID, items } = req.body;

  try {
    const [sector, zip, vendorIndex, locationIndex] = vendorID.split('-');

    const proservDoc = await Product.findOne({});
    if (!proservDoc) {
      res.status(500).json({ error: "ProServ document not found." });
      return;
    }

    const proservData: any = proservDoc.toObject();
    const classData = proservData[classID];

    if (!classData) {
      res.status(400).json({ error: `Invalid classID '${classID}'` });
      return;
    }

    const className = classData["Class Name"];
    const detailClassifier = classData["Detail Classifiers"]?.[detailID];

    if (!detailClassifier || !detailClassifier.Description) {
      res.status(400).json({ error: `Invalid detailID '${detailID}' for classID '${classID}'` });
      return;
    }

    const pathPrefix = `${zip}.${sector}.Vendors.${vendorIndex}.Locations.${locationIndex}.Products & Services.${classID}`;
    const pathToItems = `${pathPrefix}.Detail Classifiers.${detailID}.Items`;

    const vendorDoc = await Vendor.findOne({ [`${zip}.${sector}.Vendors.${vendorIndex}.Locations.${locationIndex}`]: { $exists: true } });
    if (!vendorDoc) {
      res.status(404).json({ error: "Vendor location not found." });
      return;
    }

    const currentItems = vendorDoc.get(pathToItems) || {};
    const itemStartIndex = Object.keys(currentItems).length;

    const newItems: any = {};
    items.forEach((item: any, i: number) => {
      const itemIndex = (itemStartIndex + i).toString().padStart(4, '0');
      const fullZenithID = `${classID}-${detailID}-${item.DistributorID}`;


      newItems[itemIndex] = {
        "Product Name": item.ProductName,
        "Price Per Unit": item.Price,
        "Distributor ID": item.DistributorID,
        "Zenith ID": fullZenithID,
        "Nutrition": item.Nutrition || {}
      };
    });

    const setData: any = {
      [`${pathPrefix}.Class Name`]: className,
      [`${pathPrefix}.Detail Classifiers.${detailID}.Description`]: detailClassifier.Description,
    };

    Object.entries(newItems).forEach(([index, item]) => {
      setData[`${pathToItems}.${index}`] = item;
    });

    await Vendor.updateOne(
      { [`${zip}.${sector}.Vendors.${vendorIndex}.Locations.${locationIndex}`]: { $exists: true } },
      { $set: setData }
    );

    res.status(200).json({ message: "Products & Services added successfully." });
  } catch (err) {
    console.error("Error adding products:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

