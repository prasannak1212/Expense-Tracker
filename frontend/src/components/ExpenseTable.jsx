function ExpenseTable({ expenses, type }) {
  const now = new Date();

  const filtered = expenses.filter((exp) => {
    const d = new Date(exp.created_at);

    if (type === "daily") {
      return d.toDateString() === now.toDateString();
    }

    if (type === "monthly") {
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }

    if (type === "yearly") {
      return d.getFullYear() === now.getFullYear();
    }

    return false;
  });

  return (
    <table className="expense-table">
      <thead>
        <tr>
          <th>S.No.</th>
          {type !== "daily" && <th>Date</th>}
          {type === "yearly" && <th>Month</th>}
          <th>Category</th>
          <th>Expense Name</th>
          <th>Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((exp, index) => {
          const d = new Date(exp.created_at);

          return (
            <tr key={exp.id}>
              <td>{index + 1}</td>

              {type !== "daily" && (
                <td>{d.toLocaleDateString()}</td>
              )}

              {type === "yearly" && (
                <td>{d.toLocaleString("default", { month: "short" })}</td>
              )}

              <td>{exp.category}</td>
              <td>{exp.title}</td>
              <td>₹{exp.amount}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ExpenseTable;