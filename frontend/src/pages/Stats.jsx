import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

function Stats() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    fetch(`${API_URL}/api/stats/participants`, { credentials: "include" })
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setData(data) : setData([]));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Графік реєстрацій учасників
      </h2>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#007bff" />
      </LineChart>
    </div>
  );
}

export default Stats;
