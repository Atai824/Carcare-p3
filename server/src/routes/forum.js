const express = require("express");
const Thread = require("../models/Thread");
const router = express.Router();

// простая проверка аутентификации (опирается на вашу сессию)
function requireAuth(req, res, next) {
  if (req.user) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

// GET /forum/threads — список (пагинация + поиск)
router.get("/threads", async (req, res) => {
  const { q = "", skip = 0, limit = 20 } = req.query;
  const find = q
    ? { $or: [{ title: new RegExp(q, "i") }, { body: new RegExp(q, "i") }, { tags: q.toLowerCase() }] }
    : {};

  const [items, total] = await Promise.all([
    Thread.find(find)
      .sort({ updatedAt: -1 })
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 50))
      .select("title tags author name createdAt updatedAt replies views")
      .lean(),
    Thread.countDocuments(find),
  ]);
  res.json({ items, total });
});

// POST /forum/threads — создать тему
router.post("/threads", requireAuth, async (req, res) => {
  const { title, body, tags = [] } = req.body || {};
  if (!title || !body) return res.status(400).json({ error: "title and body required" });

  const t = await Thread.create({
    title,
    body,
    tags: (Array.isArray(tags) ? tags : String(tags).split(",")).map(s => s.trim().toLowerCase()).filter(Boolean),
    author: { id: req.user._id, name: req.user.name || "User" },
  });
  res.status(201).json({ thread: t });
});

// GET /forum/threads/:id — получить тему (+увеличить просмотры)
router.get("/threads/:id", async (req, res) => {
  const t = await Thread.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).lean();
  if (!t) return res.status(404).json({ error: "Not found" });
  res.json({ thread: t });
});

// POST /forum/threads/:id/replies — добавить ответ
router.post("/threads/:id/replies", requireAuth, async (req, res) => {
  const { body } = req.body || {};
  if (!body) return res.status(400).json({ error: "body required" });

  const reply = { body, author: { id: req.user._id, name: req.user.name || "User" } };
  const t = await Thread.findByIdAndUpdate(
    req.params.id,
    { $push: { replies: reply } },
    { new: true }
  );
  if (!t) return res.status(404).json({ error: "Not found" });
  res.status(201).json({ thread: t });
});

module.exports = router;
