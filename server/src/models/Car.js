const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    // Базовая карточка авто:
    nickname: { type: String, trim: true },            // своё имя авто (опц.)
    make: { type: String, required: true, trim: true }, // Toyota, Lexus и т.д.
    model: { type: String, required: true, trim: true },// Avalon, Prius, ES350...
    year: { type: Number, min: 1900, max: 2100 },
    vin: { type: String, trim: true, uppercase: true, maxlength: 30 },
    mileage: { type: Number, min: 0, default: 0 },      // текущий пробег
    photos: [{ type: String }],                         // пока строки-URL; загрузку сделаем позже
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
