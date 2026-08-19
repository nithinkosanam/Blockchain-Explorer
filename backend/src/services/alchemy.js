const axios = require("axios");

const ALCHEMY_URL = process.env.ALCHEMY_ETH_URL;

async function alchemyRequest(method, params = []) {
  const response = await axios.post(ALCHEMY_URL, {
    jsonrpc: "2.0",
    id: 1,
    method,
    params
  });

  if (response.data.error) {
    throw new Error(response.data.error.message);
  }

  return response.data.result;
}

module.exports = {
  alchemyRequest
};