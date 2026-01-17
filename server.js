const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("panel"));

app.get("/services", (req,res)=>{
  res.json(require("./data/services.json"));
});

app.post("/order",(req,res)=>{
  const orders = require("./data/orders.json");
  orders.push(req.body);
  fs.writeFileSync("./data/orders.json", JSON.stringify(orders,null,2));
  res.json({success:true});
});

app.listen(3000);
