const Product = require("../model/productModel");
const cloudinary = require("../cloudinary");

// Create Product
const createProduct = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);

        const newProduct = new Product({
            ProductName: req.body.ProductName,
            price: req.body.price,
            qty: req.body.qty,
            ProductImage: result.secure_url
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Product
 const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let imageUrl = product.image;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "products" });
            imageUrl = result.secure_url;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                ProductName: req.body.ProductName,
                price: req.body.price,
                qty: req.body.qty,
                image: imageUrl
            },
            { new: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.image) {
            // Extract public_id only if image is present
            const parts = product.image.split('/');
            if (parts.length > 1) {
                const publicId = parts.slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } else {
                console.log("Unexpected image format:", product.image);
            }
        } else {
            console.log("No image field found for product:", product);
        }

        // Delete the product from the database
        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {createProduct, getAllProducts, getProductById, updateProduct, deleteProduct   }
