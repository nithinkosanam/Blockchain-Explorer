import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLatestBlock } from "../api";

function Home() {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

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

  function handleSearch(event) {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    // Block number
    if (/^\d+$/.test(value)) {
      navigate(`/block/${value}`);
      return;
    }

    // Ethereum address
    if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
      navigate(`/wallet/${value}`);
      return;
    }

    // Transaction hash
    if (/^0x[a-fA-F0-9]{64}$/.test(value)) {
      navigate(`/transaction/${value}`);
      return;
    }

    alert("Invalid search. Enter a block number, wallet address, or transaction hash.");
  }

  return (
    <main>
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search block, transaction hash, or wallet address"
          />

          <button type="submit">
            Search
          </button>
        </form>
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
                {new Date(
                  block.timestamp * 1000
                ).toLocaleString()}
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
  );
}

export default Home;