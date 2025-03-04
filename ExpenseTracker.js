import React, { useState, useEffect } from "react";
import axios from "axios";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ amount: "", category: "", date: "", description: "" });
  const [filter, setFilter] = useState({ category: "", date: "" });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const response = await axios.get("http://localhost:5000/expenses");
    setExpenses(response.data);
  };

  const addExpense = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/expenses", form);
    setForm({ amount: "", category: "", date: "", description: "" });
    fetchExpenses();
  };

  const filterExpenses = async () => {
    const response = await axios.get("http://localhost:5000/expenses", { params: filter });
    setExpenses(response.data);
  };

  const calculateTotal = async () => {
    const response = await axios.get("http://localhost:5000/expenses/total", { params: { start: filter.date, end: filter.date } });
    setTotal(response.data.total);
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <form onSubmit={addExpense}>
        <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <button type="submit">Add Expense</button>
      </form>
      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id}>{`${expense.date} - ${expense.category}: $${expense.amount} (${expense.description})`}</li>
        ))}
      </ul>
      <h2>Filter</h2>
      <input type="text" placeholder="Category" value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })} />
      <input type="date" value={filter.date} onChange={(e) => setFilter({ ...filter, date: e.target.value })} />
      <button onClick={filterExpenses}>Filter</button>
      <h2>Total Expenses: ${total}</h2>
      <button onClick={calculateTotal}>Calculate Total</button>
    </div>
  );
};

export default ExpenseTracker;
