import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Get all available class options
export const getClassOptions = async (req: Request, res: Response) => {
  try {
    console.log('Fetching class options from database...');
    
    // Get the proserv collection from zenith_dev database
    const proservCollection = mongoose.connection.db.collection('proserv');
    
    // Get all documents from the collection
    const classOptions = await proservCollection.find({}).toArray();
    console.log('Raw class options:', classOptions);
    
    // Transform the data to get class IDs and names
    const transformedOptions = classOptions.flatMap(doc => {
      // Get all keys except _id
      const classIds = Object.keys(doc).filter(key => key !== '_id');
      
      // Map each class ID to its name
      return classIds.map(classId => ({
        id: classId,
        name: doc[classId]["Class Name"]
      }));
    });

    console.log('Transformed class options:', transformedOptions);
    res.json(transformedOptions);
  } catch (error) {
    console.error('Error fetching class options:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ message: 'Error fetching class options' });
  }
};

// Get all products and services for a specific vendor
export const getVendorProducts = async (req: Request, res: Response) => {
  try {
    const { vendorID } = req.params;
    console.log('Fetching products for vendor:', vendorID);

    // Get the vendors collection
    const vendorsCollection = mongoose.connection.collection('vendors');
    const proservCollection = mongoose.connection.db.collection('proserv');
    
    // Extract vendor ID components
    const [sector, zipCode, vendorNumber, location] = vendorID.split('-');
    
    // Find the vendor's products
    const vendor = await vendorsCollection.findOne({
      [`${zipCode}.${sector}.Vendors.${vendorNumber}.Locations.${location}.VendorID`]: vendorID
    });

    if (!vendor) {
      console.log('No vendor found for:', vendorID);
      return res.json({ products: [], classNames: {} });
    }

    // Extract products and class names
    const products = [];
    const classNames: Record<string, string> = {};
    
    // Get all class names from proserv collection
    const proservDoc = await proservCollection.findOne({});
    if (proservDoc) {
      Object.keys(proservDoc).forEach(key => {
        if (key !== '_id' && proservDoc[key]["Class Name"]) {
          classNames[key] = proservDoc[key]["Class Name"];
        }
      });
    }

    // Check if vendor has products
    const vendorData = vendor[zipCode]?.[sector]?.Vendors?.[vendorNumber]?.Locations?.[location]?.["Products & Services"];
    
    if (vendorData) {
      Object.entries(vendorData).forEach(([classId, classData]: [string, any]) => {
        if (classData && classData["Detail Classifiers"]) {
          Object.entries(classData["Detail Classifiers"]).forEach(([detailId, detailData]: [string, any]) => {
            if (detailData && detailData.Items) {
              Object.entries(detailData.Items).forEach(([itemId, itemData]: [string, any]) => {
                products.push({
                  ProductName: itemData["Product Name"],
                  Price: itemData["Price Per Unit"],
                  ClassID: classId,
                  DetailID: detailId,
                  DistributorID: itemData["Distributor ID"] || "",
                  VendorID: vendorID,
                  Nutrition: itemData.Nutrition || {}
                });
              });
            }
          });
        }
      });
    }

    console.log('Found products:', products.length);
    console.log('Class names:', classNames);

    res.json({ products, classNames });
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Add a new product or service
export const addProduct = async (req: Request, res: Response) => {
  try {
    const { vendorID } = req.params;
    console.log('Adding new product for vendor:', vendorID);
    console.log('Product data:', req.body);

    // Extract vendor ID components
    const [sector, zipCode, vendorNumber, location] = vendorID.split('-');
    
    // Get the vendors collection
    const vendorsCollection = mongoose.connection.collection('vendors');

    // Find the vendor
    const vendor = await vendorsCollection.findOne({
      [`${zipCode}.${sector}.Vendors.${vendorNumber}.Locations.${location}.VendorID`]: vendorID
    });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Add the new product
    const result = await vendorsCollection.updateOne(
      { [`${zipCode}.${sector}.Vendors.${vendorNumber}.Locations.${location}.VendorID`]: vendorID },
      { $push: { [`${zipCode}.${sector}.Vendors.${vendorNumber}.Locations.${location}.Products & Services.${req.body.ClassID}.Detail Classifiers.${req.body.DetailID}.Items`]: {
        "Product Name": req.body.ProductName,
        "Price Per Unit": req.body.Price,
        "Distributor ID": req.body.DistributorID,
        "Nutrition": req.body.Nutrition
      }}}
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'Failed to add product' });
    }

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product' });
  }
};

// Update a product or service
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const updatedProduct = await ProServ.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete a product or service
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await ProServ.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// Get detail classifiers for a specific class
export const getDetailClassifiers = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    console.log('Fetching detail classifiers for class:', classId);
    
    // Get the proserv collection from zenith_dev database
    const proservCollection = mongoose.connection.db.collection('proserv');
    
    // Get the document for the specified class
    const classDoc = await proservCollection.findOne({ [classId]: { $exists: true } });
    
    if (!classDoc || !classDoc[classId]["Detail Classifiers"]) {
      console.log('No detail classifiers found for class:', classId);
      return res.json([]);
    }

    // Transform the detail classifiers into the required format
    const detailClassifiers = Object.entries(classDoc[classId]["Detail Classifiers"]).map(([id, data]: [string, any]) => ({
      id,
      description: data.Description || id // Fallback to id if Description is not available
    }));

    console.log('Found detail classifiers:', detailClassifiers);
    res.json(detailClassifiers);
  } catch (error) {
    console.error('Error fetching detail classifiers:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ message: 'Error fetching detail classifiers' });
  }
}; 