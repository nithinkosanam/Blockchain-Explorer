import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlock } from "../api";

function BlockPage() {
  const { number } = useParams();

  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBlock() {
      try {
        const data = await getBlock(number);
        setBlock(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load block");
      } finally {
        setLoading(false);
      }
    }

    loadBlock();
  }, [number]);

  if (loading) {
    return <main><p>Loading block...</p></main>;
  }

  if (error) {
    return <main><p>{error}</p></main>;
  }

  if (!block) {
    return <main><p>Block not found.</p></main>;
  }

  return (
    <main>
      <Link to="/">← Back to Explorer</Link>

      <h1>Block #{block.number}</h1>

      <div className="detail-card">
        <div>
          <span>Block Hash</span>
          <strong className="hash">
            {block.hash}
          </strong>
        </div>

        <div>
          <span>Parent Hash</span>
          <strong className="hash">
            {block.parentHash}
          </strong>
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
          <span>Gas Limit</span>
          <strong>{block.gasLimit}</strong>
        </div>

        <div>
          <span>Gas Used</span>
          <strong>{block.gasUsed}</strong>
        </div>

        <div>
          <span>Transactions</span>
          <strong>{block.transactionCount}</strong>
        </div>
      </div>

      <h2>Transactions</h2>

      <div className="transaction-list">
        {block.transactions.map((hash) => (
          <Link
            key={hash}
            to={`/transaction/${hash}`}
            className="transaction-row"
          >
            {hash}
          </Link>
        ))}
      </div>
    </main>
  );
}

export default BlockPage;