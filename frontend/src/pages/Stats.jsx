import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStats } from "../api";

export default function Stats() {
  const { code } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getStats(code).then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Stats for: {code}</h1>

      <div className="card">
        <p><strong>Target URL:</strong> {data.target_url}</p>
        <p><strong>Total Clicks:</strong> {data.clicks}</p>
        <p><strong>Last Clicked:</strong> {data.last_clicked || "Never"}</p>
      </div>
    </div>
  );
}
