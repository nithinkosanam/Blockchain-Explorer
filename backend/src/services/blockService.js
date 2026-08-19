const prisma = require("../db/prisma");

async function saveBlock(block) {
  const savedBlock = await prisma.block.upsert({
    where: {
      number: block.number
    },

    update: {
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: new Date(block.timestamp * 1000),
      gasLimit: block.gasLimit.toString(),
      gasUsed: block.gasUsed.toString(),
      transactionCount: block.transactions.length
    },

    create: {
      number: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: new Date(block.timestamp * 1000),
      gasLimit: block.gasLimit.toString(),
      gasUsed: block.gasUsed.toString(),
      transactionCount: block.transactions.length
    }
  });

  return savedBlock;
}

async function saveTransaction(transaction, block) {
  const savedTransaction = await prisma.transaction.upsert({
    where: {
      hash: transaction.hash
    },

    update: {
      blockNumber: block.number,
      blockHash: transaction.blockHash,
      from: transaction.from,
      to: transaction.to,
      value: transaction.value.toString(),
      gasLimit: transaction.gasLimit.toString(),
      gasPrice: transaction.gasPrice
        ? transaction.gasPrice.toString()
        : null,
      nonce: transaction.nonce,
      data: transaction.data
    },

    create: {
      hash: transaction.hash,
      blockNumber: block.number,
      blockHash: transaction.blockHash,
      from: transaction.from,
      to: transaction.to,
      value: transaction.value.toString(),
      gasLimit: transaction.gasLimit.toString(),
      gasPrice: transaction.gasPrice
        ? transaction.gasPrice.toString()
        : null,
      nonce: transaction.nonce,
      data: transaction.data
    }
  });

  return savedTransaction;
}

module.exports = {
  saveBlock,
  saveTransaction
};