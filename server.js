// server.js
const express = require("express");
const cors = require('cors');
const axios = require("axios");
const app = express();

const PORT = 5000;

app.use(express.json());
app.use(cors());

const BASE_URL = "http://localhost:3001/products";

app.post("/products", async (req, res) => {
  try {
    const response = await axios.post(BASE_URL, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const response = await axios.get(BASE_URL);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/${req.params.id}`);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Product not found", error: error.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const response = await axios.put(`${BASE_URL}/${req.params.id}`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    await axios.delete(`${BASE_URL}/${req.params.id}`);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
