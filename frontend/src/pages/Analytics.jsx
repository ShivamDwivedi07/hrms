import { useEffect, useState } from "react";
import { getAnalytics } from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAnalytics().then((r) => setData(r.data));
  }, []);

  if (!data)
    return (
      <div className="text-center py-20 text-gray-400">
        Loading analytics...
      </div>
    );

  const deptData = Object.entries(data.headcount_by_department || {}).map(
    ([name, count]) => ({ name, count }),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">HR Analytics</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Employees",
            value: data.total_employees,
            color: "blue",
          },
          { label: "Active", value: data.active_employees, color: "green" },
          {
            label: "Open Positions",
            value: data.open_positions,
            color: "purple",
          },
          {
            label: "Attrition Rate",
            value: `${data.attrition_rate}%`,
            color: "red",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {card.label}
            </p>
            <p className={`text-3xl font-bold mt-1 text-${card.color}-600`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-700 mb-4">
            Headcount by Department
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-700 mb-4">
            AI Monthly HR Summary
          </h2>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {data.ai_summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
