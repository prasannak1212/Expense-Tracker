import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ExpenseModal from "../components/ExpenseModal";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const fetchExpenses = async () => {
    const res = await api.get("/expenses/");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Group expenses by date
  const grouped = expenses.reduce((acc, exp) => {
    const date = new Date(exp.created_at);
    const dateKey = date.toDateString();

    if (!acc[dateKey]) acc[dateKey] = [];

    acc[dateKey].push(exp);
    return acc;
  }, {});

  const handleDelete = async (id) => {
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  return (
    <div className="expenses-page">
        <div className="expenses-header">
            <button
                className="back-btn"
                onClick={() => navigate("/dashboard")}
            >
                ← Back to Dashboard
            </button>

            <h2>All Expenses</h2>
        </div>
      {Object.entries(grouped).map(([dateKey, items]) => {
        const dateObj = new Date(dateKey);

        return (
          <div className="expense-day-card" key={dateKey}>
            <div className="expense-day-header">
              <span>
                {dateObj.toLocaleDateString()}
              </span>
              <span>
                {dateObj.toLocaleString("default", { weekday: "long" })}
              </span>
            </div>

            <div className="expense-day-body">
              {items.map((exp) => (
                <div className="expense-item" key={exp.id}>
                  <div>
                    <strong>{exp.title}</strong>
                    <div className="expense-meta">
                      {exp.category}
                    </div>
                  </div>

                  <div className="expense-actions">
                    <span className="expense-amount">
                      ₹{exp.amount}
                    </span>

                    <button
                      className="update-btn"
                      onClick={() => {
                        setSelectedExpense(exp);
                        setShowModal(true);
                      }}
                    >
                      Update
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(exp.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {showModal && (
          <ExpenseModal
            editExpense={selectedExpense}
            onClose={() => {
              setShowModal(false);
              setSelectedExpense(null);
            }}
            onSuccess={fetchExpenses}
          />
        )}
    </div>
  );
}

export default Expenses;