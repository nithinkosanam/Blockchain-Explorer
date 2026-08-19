const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const blocksRouter = require("./routes/blocks");

const app = express();
const PORT = process.env.PORT || 3000;
const transactionsRouter = require("./routes/transactions");
const walletsRouter = require("./routes/wallets");
const prisma = require("./db/prisma");

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


app.get("/api/db-test", async (req, res) => {
  try {
    const blockCount = await prisma.block.count();

    res.json({
      database: "connected",
      blockCount
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      database: "connection failed"
    });
  }
}); 

// Blockchain routes
app.use("/api/blocks", blocksRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/wallets", walletsRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});