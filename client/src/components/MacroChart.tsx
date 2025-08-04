import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Props = {
  protein: number;
  fat: number;
  carbs: number;
};

const COLORS = {
  Protein: "#3B82F6",
  Fat: "#EF4444",
  Carbs: "#10B981",
};

export default function MacroChart({ protein, fat, carbs }: Props) {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  const data = [
    { name: "Protein", value: protein },
    { name: "Fat", value: fat },
    { name: "Carbs", value: carbs },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-lg shadow bg-white dark:bg-gray-900 dark:shadow-lg">
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={20}
                label={({ name, value }) => `${name} ${value}g`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value}g`, name]}
              />
              <Legend layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <XAxis dataKey="name" tickFormatter={(name) => `${name} (g)`} />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => [`${value}g`, name]}
              />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() =>
            setChartType((prev) => (prev === "pie" ? "bar" : "pie"))
          }
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        >
          Switch to {chartType === "pie" ? "Bar" : "Pie"} Chart
        </button>
      </div>
    </div>
  );
}
