import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import CategoryChart from "../components/CategoryChart";
import TimeChart from "../components/TimeChart";
import ExpenseModal from "../components/ExpenseModal";
import ExpenseTable from "../components/ExpenseTable";
import SummaryCard from "../components/SummaryCard";
// import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";



function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const username = user
    ? user.split("@")[0]
    : "User";

  const fetchExpenses = async () => {
    const response = await api.get("/expenses/");
    setExpenses(response.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // prevent background scroll when modal open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);


  // Summary card logic
  const now = new Date();

const totals = {
  today: expenses
    .filter((e) => new Date(e.created_at).toDateString() === now.toDateString())
    .reduce((sum, e) => sum + e.amount, 0),

  month: expenses
    .filter((e) => {
      const d = new Date(e.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0),

  year: expenses
    .filter((e) => new Date(e.created_at).getFullYear() === now.getFullYear())
    .reduce((sum, e) => sum + e.amount, 0),
};

// comarison logic
const previousMonthTotal = expenses
  .filter((e) => {
    const d = new Date(e.created_at);
    const prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return (
      d.getMonth() === prevMonth.getMonth() &&
      d.getFullYear() === prevMonth.getFullYear()
    );
  })
  .reduce((sum, e) => sum + e.amount, 0);

const monthGrowth =
  previousMonthTotal === 0
    ? 0
    : ((totals.month - previousMonthTotal) / previousMonthTotal) * 100;

  return (
    <>
      <div className="dashboard-container">

        <div className="dashboard-header">

          <div className="dashboard-left">
            <h3 className="dashboard-greeting">
              Hi {username} 👋
            </h3>
          </div>

          <div className="dashboard-center">
            <h2>Dashboard</h2>
          </div>

          <div className="dashboard-right">
            
            <button
              className="view-expenses-btn"
              onClick={() => navigate("/expenses")}
            >
              View Expenses
            </button> 

            <button onClick={() => setShowModal(true)}>
              + Add Expense
            </button>
          </div>

        </div>

        <div className="summary-grid">
          <SummaryCard title="Today's Total" value={totals.today} />
          <SummaryCard
            title="This Month"
            value={totals.month}
            growth={monthGrowth}
          />
          <SummaryCard title="This Year" value={totals.year} />
        </div>

        <div className="charts-grid">
          <CategoryChart expenses={expenses} />
          <TimeChart expenses={expenses} />
        </div>

        <div className="tables">
          {/* DAILY TABLE */}
          <h3>Daily Expenses</h3>
          <ExpenseTable expenses={expenses} type="daily" />

          {/* MONTHLY TABLE */}
          <h3>Monthly Expenses</h3>
          <ExpenseTable expenses={expenses} type="monthly" />

          {/* YEARLY TABLE */}
          <h3>Yearly Expenses</h3>
          <ExpenseTable expenses={expenses} type="yearly" />
        </div>
        

      </div>

      {showModal && (
        <ExpenseModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchExpenses}
        />
      )}
  </>
  );
}

export default Dashboard;