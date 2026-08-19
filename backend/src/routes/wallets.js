const express = require("express");
const { ethers } = require("ethers");
const { provider } = require("../services/blockchain");
const { alchemyRequest } = require("../services/alchemy");

const router = express.Router();

function validateAddress(req, res, next) {
  const address = req.params.address;

  if (!ethers.isAddress(address)) {
    return res.status(400).json({
      error: "Invalid Ethereum address"
    });
  }

  next();
}

// Native ETH balance
router.get("/:address/balance", validateAddress, async (req, res) => {
  try {
    const address = req.params.address;

    const balance = await provider.getBalance(address);

    res.json({
      address,
      balanceWei: balance.toString(),
      balanceEth: ethers.formatEther(balance)
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch wallet balance"
    });
  }
});
const {
  getTokenMetadata
} = require("../services/tokenService");
// ERC-20 token balances
router.get("/:address/tokens", validateAddress, async (req, res) => {
  try {
    const address = req.params.address;

    const result = await alchemyRequest(
      "alchemy_getTokenBalances",
      [address]
    );

    const tokenBalances = result.tokenBalances;

    const tokens = [];

    for (const token of tokenBalances) {
      try {
        const metadata = await getTokenMetadata(
          token.contractAddress
        );

        const rawBalance = BigInt(token.tokenBalance);

        const balance = ethers.formatUnits(
          rawBalance,
          metadata.decimals
        );

        tokens.push({
          contractAddress: token.contractAddress,
          name: metadata.name,
          symbol: metadata.symbol,
          decimals: Number(metadata.decimals),
          balance: balance.toString()
        });
      } catch (error) {
        console.log(
          `Could not read token ${token.contractAddress}:`,
          error.message
        );
      }
    }

    res.json({
      address,
      tokens
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch token balances"
    });
  }
});

module.exports = router;