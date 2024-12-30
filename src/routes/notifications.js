const express = require("express");
const notificationController = require("../controllers/notificationController");
const authentication = require("../middleware/authentication");
const authorizer = require("../middleware/authorization");

const notiRouter = express.Router();

// Lấy tất cả thông báo
notiRouter.get(
  "/all",
  authentication,
  notificationController.getAllNotifications
);

// Lấy thông báo theo ID
notiRouter.get(
  "/:id",
  authentication,
  notificationController.getNotificationById
);

// Thêm thông báo mới
notiRouter.post(
  "/create",
  authentication,
  authorizer(["admin", "lecturer"]),
  notificationController.createNotification
);

// Đánh dấu thông báo đã đọc
notiRouter.put("/:id/read", authentication, notificationController.markAsRead);

// Xóa thông báo đã hết hạn
notiRouter.delete(
  "/expired",
  notificationController.deleteExpiredNotifications
);

// Xóa thông báo
notiRouter.delete(
  "/:id",
  authentication,
  authorizer(["admin", "lecturer"]),
  notificationController.deleteNotification
);

module.exports = notiRouter;
