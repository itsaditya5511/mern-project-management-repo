import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

export default function Analytics() {
  const { darkMode } = useContext(AuthContext);

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/tasks/analytics");
      setData(res.data);
    } catch (err) {
      console.error("ANALYTICS ERROR:", err);
    }
  };

  if (!data) return <h3 style={{ padding: "20px" }}>Loading...</h3>;

  // 🎯 Priority
  const priorityData = [
    { name: "High", value: data.priority.high },
    { name: "Medium", value: data.priority.medium },
    { name: "Low", value: data.priority.low },
  ];

  // 👤 Productivity
  const productivity = Object.keys(data.users).map((id, i) => ({
    name: `User ${i + 1}`,
    tasks: data.users[id],
  }));

  const COLORS = ["#22c55e", "#ef4444", "#6366f1", "#f59e0b"];

  return (
    <div
      style={{
        display: "flex",
        background: darkMode ? "#020617" : "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "25px" }}>
          <h2 style={{ color: darkMode ? "#fff" : "#000" }}>
            📊 Live Analytics Dashboard
          </h2>

          {/* STATS */}
          <div style={gridStyle}>
            {[
              { title: "Total Tasks", value: data.total },
              { title: "Completed", value: data.completed },
              { title: "Pending", value: data.pending },
              { title: "Overdue", value: data.overdue },
            ].map((item, i) => (
              <div key={i} style={cardStyle(darkMode)}>
                <h5 style={{ color: "#64748b" }}>{item.title}</h5>
                <h3 style={{ color: darkMode ? "#fff" : "#000" }}>
                  {item.value}
                </h3>
              </div>
            ))}
          </div>

          {/* CHARTS */}
          <div style={gridStyle}>
            {/* 👤 PRODUCTIVITY */}
            <div style={cardStyle(darkMode)}>
              <h4>Productivity per Member</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={productivity}>
                  <XAxis dataKey="name" stroke={textColor(darkMode)} />
                  <YAxis stroke={textColor(darkMode)} />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 🎯 PRIORITY */}
            <div style={cardStyle(darkMode)}>
              <h4>Priority Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={priorityData} dataKey="value" outerRadius={80}>
                    {priorityData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 📉 BURNDOWN (SIMULATED BASED ON TOTAL) */}
            <div style={cardStyle(darkMode)}>
              <h4>Burn-down Progress</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={[
                    { day: "Start", remaining: data.total },
                    { day: "Now", remaining: data.pending },
                  ]}
                >
                  <XAxis dataKey="day" stroke={textColor(darkMode)} />
                  <YAxis stroke={textColor(darkMode)} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="remaining"
                    stroke="#ef4444"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎨 Styles
const cardStyle = (darkMode) => ({
  padding: "20px",
  borderRadius: "12px",
  background: darkMode ? "#1e293b" : "#ffffff",
});

const textColor = (darkMode) => (darkMode ? "#fff" : "#000");

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};