const { Schema, model } = require("mongoose");

const ReplySchema = new Schema(
  {
    body: { type: String, required: true, trim: true, maxlength: 5000 },
    author: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true, trim: true, maxlength: 80 },
    },
  },
  { timestamps: true }
);

const ThreadSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, trim: true, maxlength: 5000 },
    tags: [{ type: String, trim: true, lowercase: true }],
    author: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true, trim: true, maxlength: 80 },
    },
    replies: [ReplySchema],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ThreadSchema.index({ title: "text", body: "text", tags: 1 });

module.exports = model("Thread", ThreadSchema);
