import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTransaction } from "../api";

function TransactionPage() {
  const { hash } = useParams();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTransaction() {
      try {
        const data = await getTransaction(hash);
        setTransaction(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load transaction");
      } finally {
        setLoading(false);
      }
    }

    loadTransaction();
  }, [hash]);

  if (loading) {
    return <main><p>Loading transaction...</p></main>;
  }

  if (error) {
    return <main><p>{error}</p></main>;
  }

  if (!transaction) {
    return <main><p>Transaction not found.</p></main>;
  }

  return (
    <main>
      <Link to="/">← Back to Explorer</Link>

      <h1>Transaction</h1>

      <div className="detail-card">
        <div>
          <span>Transaction Hash</span>
          <strong className="hash">
            {transaction.hash}
          </strong>
        </div>

        <div>
          <span>Status</span>
          <strong>
            {transaction.status === 1
              ? "Success"
              : transaction.status === 0
              ? "Failed"
              : "Pending"}
          </strong>
        </div>

        <div>
          <span>Block</span>
          <strong>
            {transaction.blockNumber}
          </strong>
        </div>

        <div>
          <span>From</span>
          <Link
            to={`/wallet/${transaction.from}`}
            className="hash"
          >
            {transaction.from}
          </Link>
        </div>

        <div>
          <span>To</span>

          {transaction.to ? (
            <Link
              to={`/wallet/${transaction.to}`}
              className="hash"
            >
              {transaction.to}
            </Link>
          ) : (
            <strong>Contract Creation</strong>
          )}
        </div>

        <div>
          <span>Value (Wei)</span>
          <strong>{transaction.value}</strong>
        </div>

        <div>
          <span>Gas Used</span>
          <strong>{transaction.gasUsed}</strong>
        </div>

        <div>
          <span>Gas Price</span>
          <strong>{transaction.gasPrice}</strong>
        </div>
      </div>
    </main>
  );
}

export default TransactionPage;