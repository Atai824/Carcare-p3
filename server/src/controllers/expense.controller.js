const Expense = require('../models/Expense');
const Car = require('../models/Car');

// Создать расход для конкретного авто
exports.create = async (req, res, next) => {
  try {
    const { carId, type, amount, date, note } = req.body;
    if (!carId || amount == null || !date) {
      return res.status(400).json({ error: 'carId, amount, date are required' });
    }
    // проверим, что машина принадлежит пользователю
    const car = await Car.findOne({ _id: carId, user: req.user._id });
    if (!car) return res.status(404).json({ error: 'Car not found' });

    const expense = await Expense.create({
      user: req.user._id, car: carId, type, amount, date, note
    });
    res.status(201).json({ expense });
  } catch (e) { next(e); }
};

// Список расходов по авто (или всех моих расходов, если без carId)
exports.list = async (req, res, next) => {
  try {
    const { carId } = req.query;
    const filter = { user: req.user._id };
    if (carId) filter.car = carId;
    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
    res.json({ expenses });
  } catch (e) { next(e); }
};

// Короткая сводка по авто: сумма расходов
exports.summary = async (req, res, next) => {
  try {
    const { carId } = req.params;
    const car = await Car.findOne({ _id: carId, user: req.user._id }).select('_id');
    if (!car) return res.status(404).json({ error: 'Car not found' });

    const agg = await Expense.aggregate([
      { $match: { user: req.user._id, car: car._id } },
      { $group: { _id: '$car', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    const { total = 0, count = 0 } = agg[0] || {};
    res.json({ carId, count, total });
  } catch (e) { next(e); }
};

// Удалить расход
exports.remove = async (req, res, next) => {
  try {
    const exp = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!exp) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
