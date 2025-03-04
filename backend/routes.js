const express = require('express');
const router = express.Router();
const path=require("path");
const { addExpense, getExpenses, totalExpenses } = require('./controllers.js');

// Add a new expense
router.post('/expenses', addExpense);

// Retrieve all expenses or filter by category and date
router.get('/expenses', getExpenses);

// Get total expenses for a date range
router.get('/expenses/total', totalExpenses);

router.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
})

module.exports = router;