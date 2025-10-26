const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true, index: true },
    // Тип расхода: parts / service / fuel / other
    type: { type: String, trim: true, default: 'other' },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    date: { type: Date, required: true },
    note: { type: String, trim: true },
    receiptUrl: { type: String }, // сюда позже положим файл (после шага с upload)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
