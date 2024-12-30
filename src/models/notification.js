const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  expirationDate: Date,
  isRead: { type: Boolean, default: false },
  createBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
