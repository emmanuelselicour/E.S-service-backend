const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

/* ✅ Autorisation frontend Netlify */
app.use(cors({
  origin: "https://es-services.netlify.app",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.static("panel"));

/* SERVICES */
app.get("/services", (req, res) => {
  res.json(require("./data/services.json"));
});

/* COMMANDES */
app.post("/order", (req, res) => {
  const ordersPath = "./data/orders.json";
  const orders = JSON.parse(fs.readFileSync(ordersPath, "utf-8"));
  orders.push({
    ...req.body,
    date: new Date().toISOString()
  });

  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  res.json({ success: true });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("API E.S Company en ligne");
});
