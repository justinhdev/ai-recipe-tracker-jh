import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type MacroChartProps = {
  protein: number;
  fat: number;
  carbs: number;
};

const COLORS = {
  Protein: "#3B82F6",
  Fat: "#EF4444",
  Carbs: "#10B981",
};

export default function MacroChart({ protein, fat, carbs }: MacroChartProps) {
  const data = [
    { name: "Protein", value: protein },
    { name: "Fat", value: fat },
    { name: "Carbs", value: carbs },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-lg shadow bg-transparent dark:shadow-lg transition-colors duration-300">
      <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
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
              animationDuration={1000}
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
              contentStyle={{
                backgroundColor: "#1F2937", // dark gray bg (Tailwind gray-800)
                border: "none",
                borderRadius: "0.5rem",
                color: "white",
              }}
              itemStyle={{
                color: "inherit", // will use default or theme color
                fontWeight: 500,
              }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
