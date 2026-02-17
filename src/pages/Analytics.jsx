import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalyticsData, fetchAnalyticsDataFromJson, selectAnalyticsData, selectAnalyticsLoading, selectAnalyticsError, } from "../features/analytics/analyticsSlice";
import { selectAllParticipants } from "../features/participants/participantsSlice";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,} from "recharts";

function Analytics({ source = "test" }) { 
  const dispatch = useDispatch();
  const analyticsData = useSelector(selectAnalyticsData);
  const loading = useSelector(selectAnalyticsLoading);
  const error = useSelector(selectAnalyticsError);
  const participants = useSelector(selectAllParticipants);

  useEffect(() => {
    if (source === "json") {
      dispatch(fetchAnalyticsDataFromJson());
    } else {
      dispatch(fetchAnalyticsData());
    }
  }, [dispatch, source]);

  const participantsData = participants.map((p) => ({
    date: p.createdAt
      ? p.createdAt.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    registrations: 1,
  }));

  const analyticsFormatted = analyticsData.map((d) => ({
    date: d.date,
    registrations: d.registrations,
  }));

  const combinedData = [...analyticsFormatted, ...participantsData];
  const aggregated = combinedData.reduce((acc, item) => {
    if (!item.date) return acc;
    acc[item.date] = (acc[item.date] || 0) + item.registrations;
    return acc;
  }, {});

  const chartData = Object.entries(aggregated).map(([date, registrations]) => ({ date, registrations, }));

  const total = chartData.reduce((sum, d) => sum + d.registrations, 0);
  const avg = chartData.length ? (total / chartData.length).toFixed(2) : 0;
  const max = chartData.length ? Math.max(...chartData.map((d) => d.registrations)) : 0;
  const min = chartData.length ? Math.min(...chartData.map((d) => d.registrations)) : 0;

  return (
    <div className="analytics-page">
      <h2 className="analytics-title">Аналітика реєстрацій ({source})</h2>

      {loading && <p>Завантаження даних...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="registrations"
                stroke="#007bff"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="stats-container">
            <div className="stat-card">
              <h4>Середня кількість реєстрацій</h4>
              <p>{avg}</p>
            </div>
            <div className="stat-card">
              <h4>Максимум реєстрацій</h4>
              <p>{max}</p>
            </div>
            <div className="stat-card">
              <h4>Мінімум реєстрацій</h4>
              <p>{min}</p>
            </div>
            <div className="stat-card">
              <h4>Загальна кількість реєстрацій</h4>
              <p>{total}</p>
            </div>
          </div>
        </>
      ) : (
        <p>Немає даних для аналітики</p>
      )}
    </div>
  );
}

export default Analytics;
