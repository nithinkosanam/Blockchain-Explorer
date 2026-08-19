import { useEffect, useState } from "react";
import { getLatestBlock } from "./api";
import "./App.css";

function App() {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBlock() {
      try {
        const data = await getLatestBlock();
        setBlock(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load blockchain data");
      } finally {
        setLoading(false);
      }
    }

    loadBlock();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Blockchain Explorer</h1>

        <p>
          Explore blocks, transactions, wallets, and tokens
        </p>
      </header>

      <main>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search block, transaction hash, or wallet address"
          />

          <button>Search</button>
        </div>

        <section className="latest-section">
          <h2>Latest Block</h2>

          {loading && <p>Loading blockchain data...</p>}

          {error && <p>{error}</p>}

          {block && (
            <div className="block-card">
              <div>
                <span>Block Number</span>
                <strong>#{block.number}</strong>
              </div>

              <div>
                <span>Transactions</span>
                <strong>{block.transactionCount}</strong>
              </div>

              <div>
                <span>Timestamp</span>
                <strong>
                  {new Date(block.timestamp * 1000).toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Hash</span>
                <strong className="hash">
                  {block.hash}
                </strong>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;