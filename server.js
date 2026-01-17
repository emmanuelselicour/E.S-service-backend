const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // ton front-end

const productsPath = "./data/products.json";
const ordersPath = "./data/orders.json";

// 1) Get products
app.get("/products", (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  res.json(products);
});

// 2) Add product
app.post("/products", (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    description: req.body.description
  };
  products.push(newProduct);
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  res.json({ success: true });
});

// 3) Delete product
app.delete("/products/:id", (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  const filtered = products.filter(p => p.id != req.params.id);
  fs.writeFileSync(productsPath, JSON.stringify(filtered, null, 2));
  res.json({ success: true });
});

// 4) Get orders
app.get("/orders", (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ordersPath, "utf-8"));
  res.json(orders);
});

// 5) Add order (from frontend)
app.post("/orders", (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ordersPath, "utf-8"));
  const newOrder = {
    id: Date.now(),
    productName: req.body.productName,
    price: req.body.price,
    customerName: req.body.customerName,
    phone: req.body.phone,
    date: new Date().toLocaleString()
  };
  orders.push(newOrder);
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
