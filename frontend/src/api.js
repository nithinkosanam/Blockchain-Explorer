import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api"
});

export async function getLatestBlock() {
  const response = await API.get("/blocks/latest");

  return response.data;
}

export async function getBlock(blockNumber) {
  const response = await API.get(`/blocks/${blockNumber}`);

  return response.data;
}

export async function getTransaction(hash) {
  const response = await API.get(`/transactions/${hash}`);

  return response.data;
}

export async function getWallet(address) {
  const response = await API.get(`/wallets/${address}/balance`);

  return response.data;
}

export async function getWalletTokens(address) {
  const response = await API.get(`/wallets/${address}/tokens`);

  return response.data;
}

export async function getWalletActivity(address) {
  const response = await API.get(`/wallets/${address}/activity`);

  return response.data;
}