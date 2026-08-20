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


router.get("/:address/transfers", validateAddress, async (req, res) => {
  try {
    const address = req.params.address;

    const result = await alchemyRequest(
      "alchemy_getAssetTransfers",
      [
        {
          fromAddress: address,
          category: [
            "external",
            "erc20",
            "erc721",
            "erc1155"
          ],
          withMetadata: true,
          maxCount: "0x64"
        }
      ]
    );

    const transfers = result.transfers.map((transfer) => ({
      blockNum: transfer.blockNum,
      hash: transfer.hash,
      from: transfer.from,
      to: transfer.to,
      value: transfer.value,
      asset: transfer.asset,
      category: transfer.category,
      rawContract: transfer.rawContract,
      metadata: transfer.metadata
    }));

    res.json({
      address,
      direction: "sent",
      transfers
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch token transfers"
    });
  }
});


router.get("/:address/received", validateAddress, async (req, res) => {
  try {
    const address = req.params.address;

    const result = await alchemyRequest(
      "alchemy_getAssetTransfers",
      [
        {
          toAddress: address,
          category: [
            "external",
            "erc20",
            "erc721",
            "erc1155"
          ],
          withMetadata: true,
          maxCount: "0x64"
        }
      ]
    );

    const transfers = result.transfers.map((transfer) => ({
      blockNum: transfer.blockNum,
      hash: transfer.hash,
      from: transfer.from,
      to: transfer.to,
      value: transfer.value,
      asset: transfer.asset,
      category: transfer.category,
      rawContract: transfer.rawContract,
      metadata: transfer.metadata
    }));

    res.json({
      address,
      direction: "received",
      transfers
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch received transfers"
    });
  }
});


router.get("/:address/activity", validateAddress, async (req, res) => {
  try {
    const address = req.params.address;

    const [sentResult, receivedResult] = await Promise.all([
      alchemyRequest(
        "alchemy_getAssetTransfers",
        [
          {
            fromAddress: address,
            category: [
              "external",
              "erc20",
              "erc721",
              "erc1155"
            ],
            withMetadata: true,
            maxCount: "0x64"
          }
        ]
      ),

      alchemyRequest(
        "alchemy_getAssetTransfers",
        [
          {
            toAddress: address,
            category: [
              "external",
              "erc20",
              "erc721",
              "erc1155"
            ],
            withMetadata: true,
            maxCount: "0x64"
          }
        ]
      )
    ]);

    const sent = sentResult.transfers.map((transfer) => ({
      ...transfer,
      direction: "sent"
    }));

    const received = receivedResult.transfers.map((transfer) => ({
      ...transfer,
      direction: "received"
    }));

    const activity = [...sent, ...received];

    activity.sort((a, b) => {
      const timeA = a.metadata?.blockTimestamp
        ? new Date(a.metadata.blockTimestamp).getTime()
        : 0;

      const timeB = b.metadata?.blockTimestamp
        ? new Date(b.metadata.blockTimestamp).getTime()
        : 0;

      return timeB - timeA;
    });

    res.json({
      address,
      activity
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch wallet activity"
    });
  }
});

router.get("/:address/analytics", async (req, res) => {
  try {
    const { address } = req.params;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({
        error: "Invalid Ethereum address"
      });
    }

    const balance = await provider.getBalance(address);

    res.json({
      address,
      ethBalance: ethers.formatEther(balance),
      ethBalanceWei: balance.toString()
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to load wallet analytics"
    });
  }
});


module.exports = router;