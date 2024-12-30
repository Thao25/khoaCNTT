const Notification = require("../models/notification");

// Service để lấy tất cả thông báo, sắp xepps theo ngày tạo
const getAllNotifications = async () => {
  return await Notification.find().sort({ createdDate: -1 });
};

// Service để lấy thông báo theo ID
const getNotificationById = async (id) => {
  return await Notification.findById(id);
};

// Service để thêm mới thông báo
const createNotification = async (title, content) => {
  const notification = new Notification({
    title,
    content,
  });
  return await notification.save();
};

// Service để đánh dấu thông báo đã đọc
const markAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );
};

// Service để xóa các thông báo đã hết hạn
const deleteExpiredNotifications = async () => {
  const currentDate = new Date();
  // Tìm và xóa các thông báo có expirationDate nhỏ hơn hiện tại
  return await Notification.deleteMany({
    expirationDate: { $lt: currentDate },
  });
};

const deleteNotification = async (id) => {
  return await Notification.findByIdAndDelete(id);
};
module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  deleteExpiredNotifications,
  deleteNotification,
};
