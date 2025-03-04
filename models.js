const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default : "2025-03-04"
    }
});

module.exports = mongoose.model('Expense', expenseSchema);
