const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { randomUUID } = require('crypto');
const Expense = require('../models/Expense');
const Car = require('../models/Car');

// --- общие фильтры/лимиты ---
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const imageFileFilter = (_req, file, cb) => {
  const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype);
  cb(ok ? null : new Error('Only image files are allowed'), ok);
};

// --- дисковое хранилище для чеков ---
const receiptStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads', 'receipts')),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

const photoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads', 'photos')),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

const uploadReceipt = multer({
  storage: receiptStorage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: imageFileFilter,
}).single('file');

const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: imageFileFilter,
}).single('file');

// --- контроллеры ---

// Привязать чек к существующему расходу
exports.attachReceipt = (req, res, next) => {
  uploadReceipt(req, res, async (err) => {
    try {
      if (err) return res.status(400).json({ error: err.message || 'Upload error' });
      const { expenseId } = req.params;
      const expense = await Expense.findOne({ _id: expenseId, user: req.user._id });
      if (!expense) return res.status(404).json({ error: 'Expense not found' });

      const filename = req.file.filename;
      const url = `/uploads/receipts/${filename}`;
      expense.receiptUrl = url;
      await expense.save();

      res.status(201).json({ expense });
    } catch (e) { next(e); }
  });
};

// Добавить фото в галерею авто
exports.addCarPhoto = (req, res, next) => {
  uploadPhoto(req, res, async (err) => {
    try {
      if (err) return res.status(400).json({ error: err.message || 'Upload error' });
      const { carId } = req.params;
      const car = await Car.findOne({ _id: carId, user: req.user._id });
      if (!car) return res.status(404).json({ error: 'Car not found' });

      const filename = req.file.filename;
      const url = `/uploads/photos/${filename}`;
      car.photos = car.photos || [];
      car.photos.push(url);
      await car.save();

      res.status(201).json({ car });
    } catch (e) { next(e); }
  });
};

// (опционально) удалить фото авто
exports.removeCarPhoto = async (req, res, next) => {
  try {
    const { carId, filename } = req.params;
    const car = await Car.findOne({ _id: carId, user: req.user._id });
    if (!car) return res.status(404).json({ error: 'Car not found' });

    const url = `/uploads/photos/${filename}`;
    const idx = (car.photos || []).indexOf(url);
    if (idx === -1) return res.status(404).json({ error: 'Photo not found' });

    car.photos.splice(idx, 1);
    await car.save();

    // попробуем удалить файл с диска
    const filePath = path.join(__dirname, '..', '..', url);
    fs.promises.unlink(filePath).catch(() => {});
    res.json({ ok: true });
  } catch (e) { next(e); }
};
