const notificationService = require("../services/notificationService");
// Controller để lấy tất cả thông báo
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getAllNotifications();
    res.json({
      message: "Danh sách thông báo",
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller để lấy thông báo theo ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await notificationService.getNotificationById(
      req.params.id
    );
    if (!notification) {
      return res.status(404).json({ message: "Thông báo không tồn tại" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller để thêm mới thông báo
const createNotification = async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log("data", title, content);
    if (!title || !content) {
      return res.status(400).json({ message: "Thiếu các trường bắt buộc" });
    }
    const notification = await notificationService.createNotification(
      title,
      content
    );
    res.status(201).json({
      message: "Tạo thông báo thành công",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller để đánh dấu thông báo đã đọc
const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Thông báo không tồn tại" });
    }
    res.json("Thông báo đã được đánh dấu là đã đọc");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller để xóa thông báo đã hết hạn
const deleteExpiredNotifications = async (req, res) => {
  try {
    await notificationService.deleteExpiredNotifications();
    res.json({ message: "Xóa thông báo hết hạn thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await notificationService.deleteNotification(
      req.params.id
    );
    if (!notification) {
      return res.status(404).json({ message: "Thông báo không tồn tại" });
    }
    res.status(200).json({ message: "Xóa thông báo thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  deleteExpiredNotifications,
  deleteNotification,
};
