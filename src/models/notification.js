const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  expirationDate: Date, // Ngày hết hạn thông báo
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Nếu muốn liên kết người tạo thông báo
});

const Notification = mongoose.model("Notification", notificationSchema);

Notification.find()
  .populate("userId") // Lấy thông tin người tạo thông báo từ bảng User
  .exec((err, notifications) => {
    if (err) {
      console.log(err);
    } else {
      console.log(notifications);
    }
  });

module.exports = Notification;
