// Проверка, что документ принадлежит текущему пользователю
module.exports = (getOwnerId) => async (req, res, next) => {
  try {
    const ownerId = await getOwnerId(req);
    if (!ownerId || !req.user || ownerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Not found' }); // не раскрываем существование чужих сущностей
    }
    next();
  } catch (e) {
    next(e);
  }
};
