const Car = require('../models/Car');

// Создать авто
exports.create = async (req, res, next) => {
  try {
    const { nickname, make, model, year, vin, mileage } = req.body;
    if (!make || !model) return res.status(400).json({ error: 'make and model are required' });
    const car = await Car.create({
      user: req.user._id,
      nickname, make, model, year, vin, mileage
    });
    res.status(201).json({ car });
  } catch (e) { next(e); }
};

// Список моих авто
exports.list = async (req, res, next) => {
  try {
    const cars = await Car.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ cars });
  } catch (e) { next(e); }
};

// Получить одно авто
exports.getOne = async (req, res, next) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, user: req.user._id });
    if (!car) return res.status(404).json({ error: 'Not found' });
    res.json({ car });
  } catch (e) { next(e); }
};

// Обновить авто
exports.update = async (req, res, next) => {
  try {
    const { nickname, make, model, year, vin, mileage, photos } = req.body;
    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { nickname, make, model, year, vin, mileage, photos } },
      { new: true, runValidators: true }
    );
    if (!car) return res.status(404).json({ error: 'Not found' });
    res.json({ car });
  } catch (e) { next(e); }
};

// Удалить авто
exports.remove = async (req, res, next) => {
  try {
    const del = await Car.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!del) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
