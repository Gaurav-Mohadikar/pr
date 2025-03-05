import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Printer, ArrowLeft, Check, Plus, Minus, ShoppingCart } from "lucide-react";


function App() {
  const [products, setProducts] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [formData, setFormData] = useState({
    billNo: `BILL-${Date.now()}`,
    name: "",
    email: "",
    mobile: "",
    address: "",
    gst: "",
  });
  const [showSummary, setShowSummary] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/product/allProduct');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Map the database fields to our required structure
        const mappedProducts = data.map(product => ({
          id: product._id,
          name: product.ProductName,
          price: product.price,
          quantity: product.qty,
          image: product.ProductImage,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }));
        setProducts(mappedProducts);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return matchesSearch;
  });

  const addToCart = (product) => {
    if (!product || product.quantity <= 0) {
      showNotification("Product out of stock!", "error");
      return;
    }

    const existingItem = billItems.find((item) => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        showNotification("Not enough stock available!", "error");
        return;
      }
      setBillItems(
        billItems.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setBillItems([
        ...billItems,
        {
          id: Date.now(),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }

    // Update product quantity
    setProducts(
      products.map((p) =>
        p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
      )
    );
    showNotification(`Added ${product.name} to cart`);
  };

  const removeFromCart = (item) => {
    if (!item) return;
    
    // Restore product quantity
    setProducts(
      products.map((p) =>
        p.id === item.productId
          ? { ...p, quantity: (p.quantity || 0) + item.quantity }
          : p
      )
    );
    setBillItems(billItems.filter((i) => i.id !== item.id));
    showNotification("Item removed from cart", "error");
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const item = billItems.find((i) => i.id === itemId);
    if (!item) return;

    const product = products.find((p) => p.id === item.productId);
    if (!product) return;

    const quantityDiff = newQuantity - item.quantity;

    if (quantityDiff > 0 && quantityDiff > product.quantity) {
      showNotification("Not enough stock available!", "error");
      return;
    }

    setBillItems(
      billItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    setProducts(
      products.map((p) =>
        p.id === item.productId
          ? { ...p, quantity: p.quantity - quantityDiff }
          : p
      )
    );
  };

  const calculateTotal = () => {
    return billItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('bill-print-section');
    if (!printContent) return;
    
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8 mt-14">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          {["Select Products", "Customer Details", "Review & Confirm", "Final Bill"].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step > index + 1 ? "bg-green-500" : step === index + 1 ? "bg-blue-500" : "bg-gray-300"
                } text-white`}
              >
                {step > index + 1 ? <Check size={16} /> : index + 1}
              </div>
              <div className="ml-2 hidden md:block">{stepName}</div>
              {index < 3 && (
                <div className="w-24 h-1 mx-4 hidden md:block bg-gray-200">
                  <div
                    className={`h-full ${step > index + 1 ? "bg-green-500" : "bg-gray-300"}`}
                    style={{ width: step > index + 1 ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="mb-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">Stock: {product.quantity}</span>
                          <span className="font-bold text-lg">₹{product.price}</span>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.quantity <= 0}
                          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300"
                        >
                          Add to Bill
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )} */}


{step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder=" Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <ShoppingCart className="text-blue-500 cursor-pointer hover:scale-105 transition-transform" />
          </div>

          <div className="border rounded-lg p-4 bg-white shadow-xl">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                className="flex items-center justify-between border-b py-3 last:border-none hover:bg-gray-50 transition-colors p-2 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  {/* <input type="radio" name="product" className="w-5 h-5 accent-blue-500 cursor-pointer" /> */}
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                    <span className="text-sm text-gray-500">Stock: {product.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-lg text-blue-600">₹{product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.quantity <= 0}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105 disabled:bg-gray-300"
                >
                  Add ➕
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

            {step === 2 && (
              <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Bill Number</label>
                    <input
                      type="text"
                      value={formData.billNo}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mobile</label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GST Number</label>
                    <input
                      type="text"
                      value={formData.gst}
                      onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 border border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Review Order</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Customer Information</h3>
                      <div className="space-y-1">
                        <p><span className="font-medium">Name:</span> {formData.name}</p>
                        <p><span className="font-medium">Email:</span> {formData.email}</p>
                        <p><span className="font-medium">Mobile:</span> {formData.mobile}</p>
                        <p><span className="font-medium">Address:</span> {formData.address}</p>
                        <p><span className="font-medium">GST:</span> {formData.gst}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Order Summary</h3>
                      <div className="space-y-1">
                        <p><span className="font-medium">Bill Number:</span> {formData.billNo}</p>
                        <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                        <p><span className="font-medium">Total Items:</span> {billItems.length}</p>
                        <p><span className="font-medium">Total Amount:</span> ₹{calculateTotal()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <div className="border rounded">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-4">Product</th>
                            <th className="text-right p-4">Price</th>
                            <th className="text-right p-4">Quantity</th>
                            <th className="text-right p-4">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {billItems.map((item) => (
                            <tr key={item.id} className="border-t">
                              <td className="p-4">{item.name}</td>
                              <td className="p-4 text-right">₹{item.price}</td>
                              <td className="p-4 text-right">{item.quantity}</td>
                              <td className="p-4 text-right">₹{item.price * item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr className="border-t">
                            <td colSpan={3} className="p-4 text-right font-bold">Total:</td>
                            <td className="p-4 text-right font-bold">₹{calculateTotal()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 border border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                      Generate Bill
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-4 flex justify-end gap-4">
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    <ArrowLeft size={20} />
                    Back
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    <Printer size={20} />
                    Print Bill
                  </button>
                </div>

                <div id="bill-print-section" className="bg-white p-8 rounded-lg shadow">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Invoice</h1>
                    <p className="text-gray-500">#{formData.billNo}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h2 className="font-bold mb-2">Bill To:</h2>
                      <div className="space-y-1">
                        <p className="font-medium">{formData.name}</p>
                        <p>{formData.address}</p>
                        <p>Phone: {formData.mobile}</p>
                        <p>Email: {formData.email}</p>
                        {formData.gst && <p>GST: {formData.gst}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="font-bold mb-2">Bill Details:</h2>
                      <div className="space-y-1">
                        <p>Date: {new Date().toLocaleDateString()}</p>
                        <p>Time: {new Date().toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>

                  <table className="w-full mb-8">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left py-2">Item</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Quantity</th>
                        <th className="text-right py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billItems.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2">{item.name}</td>
                          <td className="text-right py-2">₹{item.price}</td>
                          <td className="text-right py-2">{item.quantity}</td>
                          <td className="text-right py-2">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-bold">
                        <td colSpan={3} className="text-right py-4">Total Amount:</td>
                        <td className="text-right py-4">₹{calculateTotal()}</td>
                      </tr>
                    </tfoot>
                  </table>

                  <div className="text-center text-gray-500 mt-8">
                    <p>Thank you for your business!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart Summary Panel */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">BILL SUMMARY</h3>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{billItems.length} items</div>
              </div>

              <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
                {billItems.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <motion.div key={item.id} layout className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={product?.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">₹{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && billItems.length === 0}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(4)}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Generate Bill
                  </button>
                )}
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="w-full border border-blue-500 text-blue-500 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;