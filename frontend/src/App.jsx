import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import BlockPage from "./pages/BlockPage";
import TransactionPage from "./pages/TransactionPage";
import WalletPage from "./pages/WalletPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <h1>Blockchain Explorer</h1>
        <p>
          Explore blocks, transactions, wallets, and tokens
        </p>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/block/:number"
          element={<BlockPage />}
        />

        <Route
          path="/transaction/:hash"
          element={<TransactionPage />}
        />

        <Route
          path="/wallet/:address"
          element={<WalletPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;