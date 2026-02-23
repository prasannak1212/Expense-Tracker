import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useState, useMemo } from "react";

function TimeChart({ expenses }) {
  const [filter, setFilter] = useState("daily");

  const { data, xLabel } = useMemo(() => {
    if (!expenses) return { data: [], xLabel: "" };

    const now = new Date();

    // ---------------- DAILY (BAR CHART - CATEGORY) ----------------
    if (filter === "daily") {
      const todayStr = now.toDateString();

      const categoryTotals = expenses
        .filter((exp) => new Date(exp.created_at).toDateString() === todayStr)
        .reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
          return acc;
        }, {});

      const data = Object.entries(categoryTotals).map(([category, total]) => ({
        label: category,
        total,
      }));

      return { data, xLabel: "Category" };
    }

    // ---------------- WEEKLY (Mon → Sun) ----------------
    if (filter === "weekly") {
      const startOfWeek = new Date(now);
      const day = now.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      startOfWeek.setDate(now.getDate() + diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      const data = days.map((label, index) => {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + index);

        const total = expenses
          .filter((exp) => {
            const d = new Date(exp.created_at);
            return (
              d.getFullYear() === currentDay.getFullYear() &&
              d.getMonth() === currentDay.getMonth() &&
              d.getDate() === currentDay.getDate()
            );
          })
          .reduce((sum, exp) => sum + exp.amount, 0);

        return { label, total };
      });

      return { data, xLabel: "Days of Week" };
    }

    // ---------------- MONTHLY (1 → 31) ----------------
    if (filter === "monthly") {
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const data = Array.from({ length: daysInMonth }, (_, i) => {
        const dayNumber = i + 1;

        const total = expenses
          .filter((exp) => {
            const d = new Date(exp.created_at);
            return (
              d.getFullYear() === year &&
              d.getMonth() === month &&
              d.getDate() === dayNumber
            );
          })
          .reduce((sum, exp) => sum + exp.amount, 0);

        return { label: dayNumber.toString(), total };
      });

      return { data, xLabel: "Date of Month" };
    }

    // ---------------- YEARLY (Jan → Dec) ----------------
    if (filter === "yearly") {
      const year = now.getFullYear();
      const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec",
      ];

      const data = months.map((label, index) => {
        const total = expenses
          .filter((exp) => {
            const d = new Date(exp.created_at);
            return (
              d.getFullYear() === year &&
              d.getMonth() === index
            );
          })
          .reduce((sum, exp) => sum + exp.amount, 0);

        return { label, total };
      });

      return { data, xLabel: "Months" };
    }

    return { data: [], xLabel: "" };
  }, [expenses, filter]);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>
          {filter === "daily"
            ? "Today's Expense"
            : "Expense Over Time"}
        </h3>

        <select
          className="chart-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {filter === "daily" ? (
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 40, bottom: 50 }}
            >
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

            <XAxis
                dataKey="label"
                tickMargin={10}
                label={{
                value: xLabel,
                position: "bottom",
                offset: 20,
                }}
            />

            <YAxis
                tickMargin={10}
                label={{
                value: "Amount (₹)",
                angle: -90,
                position: "insideLeft",
                offset: -10,
                }}
            />

            <Tooltip />

            {/* <Bar dataKey="total" fill="#2563eb" /> */}
            <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={1} />
            </linearGradient>
            </defs>

            <Bar
                dataKey="total"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                animationDuration={800}
                style={{
                    filter: "drop-shadow(0px 4px 8px rgba(37,99,235,0.4))"
                }}
            />
          </BarChart>
        ) : (
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 40, bottom: 50 }}
            >
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

            <XAxis
                dataKey="label"
                tickMargin={10}
                label={{
                value: xLabel,
                position: "bottom",
                offset: 20,
                }}
            />

            <YAxis
                tickMargin={10}
                label={{
                value: "Amount (₹)",
                angle: -90,
                position: "insideLeft",
                offset: -10,
                }}
            />

            <Tooltip />

            {/* <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={3}
            /> */}
            <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5, fill: "#2563eb" }}
                activeDot={{
                    r: 8,
                    style: { filter: "drop-shadow(0px 0px 6px rgba(37,99,235,0.7))" }
                }}
                animationDuration={800}
            />
            </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default TimeChart;