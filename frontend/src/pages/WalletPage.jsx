import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getWallet,
  getWalletTokens,
  getWalletActivity
} from "../api";

function WalletPage() {
  const { address } = useParams();

  const [wallet, setWallet] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [activity, setActivity] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadWallet() {
      try {
        const [balanceData, tokenData, activityData] =
          await Promise.all([
            getWallet(address),
            getWalletTokens(address),
            getWalletActivity(address)
          ]);

        setWallet(balanceData);
        setTokens(tokenData.tokens);
        setActivity(activityData.activity);
      } catch (err) {
        console.error(err);
        setError("Failed to load wallet");
      } finally {
        setLoading(false);
      }
    }

    loadWallet();
  }, [address]);

  if (loading) {
    return <main><p>Loading wallet...</p></main>;
  }

  if (error) {
    return <main><p>{error}</p></main>;
  }

  return (
    <main>
      <Link to="/">← Back to Explorer</Link>

      <h1>Wallet</h1>

      <div className="detail-card">
        <div>
          <span>Address</span>
          <strong className="hash">
            {address}
          </strong>
        </div>

        <div>
          <span>ETH Balance</span>
          <strong>
            {wallet?.balanceEth} ETH
          </strong>
        </div>
      </div>

      <h2>Token Holdings</h2>

      <div className="token-list">
        {tokens.length === 0 ? (
          <p>No tokens found.</p>
        ) : (
          tokens.map((token) => (
            <div
              className="token-row"
              key={token.contractAddress}
            >
              <strong>{token.name}</strong>

              <span>{token.symbol}</span>

              <span>{token.balance}</span>
            </div>
          ))
        )}
      </div>

      <h2>Activity</h2>

      <div className="transaction-list">
        {activity.length === 0 ? (
          <p>No activity found.</p>
        ) : (
          activity.map((transfer, index) => (
            <div
              className="transaction-row"
              key={`${transfer.hash}-${index}`}
            >
              <div>
                <strong>
                  {transfer.direction.toUpperCase()}
                </strong>

                <span>
                  {transfer.asset || "ETH"}
                </span>

                <span>
                  {transfer.value}
                </span>
              </div>

              <Link
                to={`/transaction/${transfer.hash}`}
                className="hash"
              >
                {transfer.hash}
              </Link>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default WalletPage;