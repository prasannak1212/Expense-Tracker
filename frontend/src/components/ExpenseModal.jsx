import { useState, useEffect } from "react";
import api from "../api/axios";

function ExpenseModal({ onClose, onSuccess, editExpense }) {
  const isEdit = !!editExpense;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // Pre-fill if editing
  useEffect(() => {
    if (editExpense) {
      setTitle(editExpense.title);
      setAmount(editExpense.amount);
      setCategory(editExpense.category);
    }
  }, [editExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      await api.put(`/expenses/${editExpense.id}`, {
        title,
        amount: Number(amount),
        category,
      });
    } else {
      await api.post("/expenses/", {
        title,
        amount: Number(amount),
        category,
      });
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{isEdit ? "Update Expense" : "Add Expense"}</h3>

        <form className="form" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
          />

          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            required
          />

          <div className="modal-buttons">
            <button type="submit">
              {isEdit ? "Save Changes" : "Add"}
            </button>

            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseModal;