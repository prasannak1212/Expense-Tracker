import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function CategoryChart({ expenses }) {
  const categoryData = Object.values(
    expenses.reduce((acc, exp) => {
      acc[exp.category] = acc[exp.category] || {
        name: exp.category,
        value: 0,
      };
      acc[exp.category].value += exp.amount;
      return acc;
    }, {})
  );

  const COLORS = [
    "#2563eb",
    "#9333ea",
    "#06b6d4",
    "#f59e0b",
    "#ef4444",
    "#22c55e",
  ];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Category Wise Expense</h3>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <defs>
            <filter id="shadow">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="6"
                floodColor="#000"
                floodOpacity="0.15"
              />
            </filter>
          </defs>

          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            filter="url(#shadow)"
            animationDuration={800}
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                style={{
                  filter:
                    "drop-shadow(0px 4px 8px rgba(0,0,0,0.15))",
                }}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;