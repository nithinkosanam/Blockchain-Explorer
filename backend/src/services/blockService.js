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

module.exports = {
  saveBlock
};