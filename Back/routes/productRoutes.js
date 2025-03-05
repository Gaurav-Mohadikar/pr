const express = require("express");
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controller/productController");
const multer = require("multer");
const router = express.Router();

const upload = multer({ dest: "uploads/" })

router.post("/create", upload.single("ProductImage"),createProduct);
router.get("/allProduct",getAllProducts);
router.get("/ProductById/:id",getProductById);
router.put("/update/:id", upload.single("ProductImage"),updateProduct);
router.delete("/delete/:id",deleteProduct);

module.exports = router;

// http://localhost:3000/api/product/allEmp 
// http://localhost:3000/api/product/createEmp 
// http://localhost:3000/api/product/update/id 
// http://localhost:3000/api/product/delete/id 