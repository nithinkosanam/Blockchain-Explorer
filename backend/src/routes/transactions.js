const express = require("express");
const { provider } = require("../services/blockchain");

const router = express.Router();
const prisma = require("../db/prisma");


router.get("/stored/:hash", async (req, res) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        hash: req.params.hash
      }
    });

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found in database"
      });
    }

    res.json(transaction);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch stored transaction"
    });
  }
});


router.get("/:hash", async (req, res) => {
  try {
    const hash = req.params.hash;

    const transaction = await provider.getTransaction(hash);

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found"
      });
    }

    const receipt = await provider.getTransactionReceipt(hash);

    res.json({
      hash: transaction.hash,
      blockNumber: transaction.blockNumber,
      blockHash: transaction.blockHash,
      from: transaction.from,
      to: transaction.to,
      value: transaction.value.toString(),
      gasLimit: transaction.gasLimit.toString(),
      gasPrice: transaction.gasPrice
        ? transaction.gasPrice.toString()
        : null,
      nonce: transaction.nonce,
      data: transaction.data,
      status: receipt ? receipt.status : null,
      gasUsed: receipt ? receipt.gasUsed.toString() : null
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch transaction"
    });
  }
});

module.exports = router;