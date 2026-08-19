const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const blocksRouter = require("./routes/blocks");

const app = express();
const PORT = process.env.PORT || 3000;
const transactionsRouter = require("./routes/transactions");

app.use(cors());
app.use(helmet());
app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.json({
    message: "Blockchain Explorer API is running"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// Blockchain routes
app.use("/api/blocks", blocksRouter);
app.use("/api/transactions", transactionsRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});