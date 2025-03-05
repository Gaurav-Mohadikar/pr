const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    ProductName: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    ProductImage: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
