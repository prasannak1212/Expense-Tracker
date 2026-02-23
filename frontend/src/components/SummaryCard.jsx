import { useEffect, useState } from "react";

function SummaryCard({ title, value, growth }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(counter);
      }
      setDisplayValue(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <div className="summary-card">
      <h4>{title}</h4>

      <h2>₹{displayValue}</h2>

      {/* 👇 ADD GROWTH HERE */}
      {growth !== undefined && (
        <p
          style={{
            fontSize: "14px",
            marginTop: "6px",
            color: growth >= 0 ? "#06f95f" : "#ef4444",
            fontWeight: "700",
          }}
        >
          {growth >= 0 ? "↑" : "↓"} {Math.abs(growth).toFixed(1)}%
          <span style={{ marginLeft: "6px", opacity: 0.8 }}>
            vs last month
          </span>
        </p>
      )}
    </div>
  );
}

export default SummaryCard;