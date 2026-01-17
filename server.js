const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://es-services.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// ===== API PUBLIC =====
app.get("/services", (req, res) => {
  const services = JSON.parse(fs.readFileSync("./data/services.json", "utf-8"));
  res.json(services);
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

// ===== API ADMIN =====
app.get("/admin/services", (req, res) => {
  const services = JSON.parse(fs.readFileSync("./data/services.json", "utf-8"));
  res.json(services);
});

app.post("/admin/services", (req, res) => {
  const servicesPath = "./data/services.json";
  const services = JSON.parse(fs.readFileSync(servicesPath, "utf-8"));

  const newService = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price
  };

  services.push(newService);
  fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));

  res.json({ success: true });
});

app.get("/admin/orders", (req, res) => {
  const orders = JSON.parse(fs.readFileSync("./data/orders.json", "utf-8"));
  res.json(orders);
});

// ===== PANEL ROUTES =====
app.get("/panel", (req, res) => {
  res.sendFile(path.join(__dirname, "panel", "index.html"));
});

app.get("/panel/services", (req, res) => {
  res.sendFile(path.join(__dirname, "panel", "services.html"));
});

app.get("/panel/orders", (req, res) => {
  res.sendFile(path.join(__dirname, "panel", "orders.html"));
});

// ===== Static assets (CSS) =====
app.use("/css", express.static(path.join(__dirname, "css")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
