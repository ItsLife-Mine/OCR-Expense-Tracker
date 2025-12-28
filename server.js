const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB (Ensure MongoDB Compass is running)
mongoose.connect('mongodb://127.0.0.1:27017/expenseTracker')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// 2. Define Transaction Schema
const TransactionSchema = new mongoose.Schema({
    merchant: String,
    amount: Number,
    category: String,
    date: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('Transaction', TransactionSchema);

// 3. API Routes
app.post('/api/expenses', async (req, res) => {
    try {
        const newExpense = new Transaction(req.body);
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/expenses', async (req, res) => {
    const expenses = await Transaction.find();
    res.json(expenses);
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));