import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpenseTracker.css";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ amount: "", category: "", date: "", description: "" });
  const [filter, setFilter] = useState({ category: "", startDate: "", endDate: "" });
  const [total, setTotal] = useState(0);
  const [totalWithoutFilter, setTotalWithoutFilter] = useState(0);

  useEffect(() => {
    fetchExpenses();
    calculateTotal(false); // Fetch total expenses without filters on load
  }, []);

  const fetchExpenses = async (useFilter = false) => {
    try {
      let response;
      if (useFilter && (filter.category || filter.startDate || filter.endDate)) {
        response = await axios.get("http://localhost:5000/expenses", { params: filter });
      } else {
        response = await axios.get("http://localhost:5000/expenses");
      }
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/expenses", form);
      setForm({ amount: "", category: "", date: "", description: "" });
      fetchExpenses();
      calculateTotal(false); // Recalculate total expenses after adding
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const filterExpenses = () => {
    fetchExpenses(true);
  };

  const calculateTotal = async (isFilter) => {
    try {
      const params = isFilter
        ? { category: filter.category, start: filter.startDate, end: filter.endDate }
        : {};
      const response = await axios.get("http://localhost:5000/expenses/total", { params });
      if (isFilter) {
        setTotal(response.data.total);
      } else {
        setTotalWithoutFilter(response.data.total);
      }
    } catch (error) {
      console.error("Error calculating total expenses:", error);
    }
  };

  return (
    <div className="container">
      <h1>Expense Tracker</h1>
      <form onSubmit={addExpense} className="expense-form">
        <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <button type="submit">Add Expense</button>
      </form>

      <h2>Filter</h2>
      <input type="text" placeholder="Category" value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })} />
      <input type="date" placeholder="Start Date" value={filter.startDate} onChange={(e) => setFilter({ ...filter, startDate: e.target.value })} />
      <input type="date" placeholder="End Date" value={filter.endDate} onChange={(e) => setFilter({ ...filter, endDate: e.target.value })} />
      <button onClick={filterExpenses}>Filter</button>

      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id}>{`${expense.date} - ${expense.category}: $${expense.amount} (${expense.description})`}</li>
        ))}
      </ul>

      <h2>Total Expenses Without Filter</h2>
      <button onClick={() => calculateTotal(false)}>Calculate Total</button>
      <h3>Total: ${totalWithoutFilter}</h3>

      <h2>Total Expenses for Filter</h2>
      <button onClick={() => calculateTotal(true)}>Calculate Total</button>
      <h3>Total: ${total}</h3>
    </div>
  );
};

export default ExpenseTracker;
