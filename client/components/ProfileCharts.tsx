import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#60a5fa", "#34d399", "#f97316", "#ef4444", "#8b5cf6", "#f472b6", "#facc15", "#94a3b8"];

export default function ProfileCharts({ profile }: { profile: any }) {
  const scores = profile?.scores ?? null;
  if (!scores) return null;
  const entries = Object.entries(scores).map(([k, v]: any, i) => ({ name: k, value: Number(v) }));

  return (
    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="p-3 rounded-2xl border bg-card">
        <h4 className="font-semibold mb-2">Puan Dağılımı</h4>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={entries} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8">
                {entries.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-3 rounded-2xl border bg-card">
        <h4 className="font-semibold mb-2">Tablo</h4>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={entries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
