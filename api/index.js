const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const Transaction = require("./models/Transaction.js");

// connecting to database and that is done as soon as our app is hosted
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.error("Couldnt connect to mongo db", err));

app.use(cors());
app.use(express.json()); 

app.get("/api/test", (req, res) => {
  res.json({ body: "test ok" });
});

app.post("/api/transaction", async (req, res) => {
  // await mongoose.connect(process.env.MONGO_URL);
  const { name, description, price, datetime } = req.body;
  // Transaction.create({ name, description, price, datetime });
  const transaction = await Transaction.create({
    name,
    description,
    price,
    datetime,
  });

  res.json(transaction);
});

app.get("/api/transactions", async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.delete("/api/transaction/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Transaction.findByIdAndDelete(id);

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error occured: ", error);
  }
});

app.listen(3000, () => {
  console.log("Hello world ");
});
