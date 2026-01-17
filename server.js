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

// Services
app.get("/services", (req, res) => {
  const services = JSON.parse(fs.readFileSync("./data/services.json", "utf-8"));
  res.json(services);
});

// Order
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

// ===== PANEL ROUTE =====
app.get("/panel", (req, res) => {
  res.sendFile(path.join(__dirname, "panel", "index.html"));
});

// ===== Static assets (CSS) =====
app.use("/css", express.static(path.join(__dirname, "css")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
