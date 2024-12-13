const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const PORT = 5000;

app.use(express.json());

app.use(bodyParser.json());
app.use(cors());

const BASE_URL = "http://localhost:3001/products";
const SECRET_KEY = "product-demo";

const users = [
  { username: "admin", password: "pass@admin" }, //  user
];

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "24h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post("/products", authenticateJWT, async (req, res) => {
  try {
    const response = await axios.post(BASE_URL, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
});

app.get("/products", authenticateJWT, async (req, res) => {
  try {
    const response = await axios.get(BASE_URL);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

app.get("/products/:id", authenticateJWT, async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/${req.params.id}`);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Product not found", error: error.message });
  }
});

app.put("/products/:id", authenticateJWT, async (req, res) => {
  try {
    const response = await axios.put(`${BASE_URL}/${req.params.id}`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
});

app.delete("/products/:id", authenticateJWT, async (req, res) => {
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
