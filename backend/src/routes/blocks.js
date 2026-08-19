const express = require("express");
const { provider } = require("../services/blockchain");
const {
  saveBlock,
  saveTransaction
} = require("../services/blockService");
const router = express.Router();
const prisma = require("../db/prisma");

// Get the latest block
router.get("/latest", async (req, res) => {
  try {
    const block = await provider.getBlock("latest");

    if (!block) {
      return res.status(404).json({
        error: "Latest block not found"
      });
    }

    await saveBlock(block);

    const transactions = [];

    for (const hash of block.transactions) {
      const transaction = await provider.getTransaction(hash);

      if (!transaction) {
        continue;
      }

      await saveTransaction(transaction, block);

      transactions.push(transaction);
    }

    res.json({
      number: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: block.timestamp,
      gasLimit: block.gasLimit.toString(),
      gasUsed: block.gasUsed.toString(),
      transactionCount: transactions.length,
      transactions: transactions.map((tx) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value.toString(),
        nonce: tx.nonce
      }))
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch latest block"
    });
  }
});

// Get a specific block
router.get("/:number", async (req, res) => {
  try {
    const blockNumber = Number(req.params.number);

    if (!Number.isInteger(blockNumber) || blockNumber < 0) {
      return res.status(400).json({
        error: "Invalid block number"
      });
    }

    const block = await provider.getBlock(blockNumber);

    if (!block) {
      return res.status(404).json({
        error: "Block not found"
      });
    }

    res.json({
      number: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: block.timestamp,
      gasLimit: block.gasLimit.toString(),
      gasUsed: block.gasUsed.toString(),
      transactionCount: block.transactions.length,
      transactions: block.transactions
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch block"
    });
  }
});


router.get("/stored/latest", async (req, res) => {
  try {
    const block = await prisma.block.findFirst({
      orderBy: {
        number: "desc"
      }
    });

    if (!block) {
      return res.status(404).json({
        error: "No blocks stored"
      });
    }

    res.json(block);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch stored block"
    });
  }
});


module.exports = router;