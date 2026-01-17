const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://es-services.netlify.app",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// ===== ROUTES API =====

// Services (products)
app.get("/products", (req, res) => {
  const products = JSON.parse(fs.readFileSync("./data/products.json", "utf-8"));
  res.json(products);
});

// Add product (from panel)
app.post("/products", (req, res) => {
  const productsPath = "./data/products.json";
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image
  };

  products.push(newProduct);
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

  res.json({ success: true });
});

// Orders
app.get("/orders", (req, res) => {
  const orders = JSON.parse(fs.readFileSync("./data/orders.json", "utf-8"));
  res.json(orders);
});

app.post("/order", (req, res) => {
  const ordersPath = "./data/orders.json";
  const orders = JSON.parse(fs.readFileSync(ordersPath, "utf-8"));

  const newOrder = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email || "",
    service: req.body.service,
    details: req.body.details || "",
    date: new Date().toISOString()
  };

  orders.push(newOrder);
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));

  res.json({ success: true });
});

// ===== PANEL =====
app.get("/panel", (req, res) => {
  res.sendFile(path.join(__dirname, "panel", "index.html"));
});

// Allow panel to access css
app.use("/css", express.static(path.join(__dirname, "css")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
