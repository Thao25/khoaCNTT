const express = require("express");
const {
  createUser,
  handleLogin,
  getAllUser,
  getAccount,
  updateUserByAdmin,
} = require("../controllers/userController");
const authentication = require("../middleware/authentication");
const authorizer = require("../middleware/authorization");
const userRouter = express.Router();
const delay = require("../middleware/delay");
const { uploadProfileImage } = require("../middleware/uploads");

// tạo tài khoản người dùng
userRouter.post(
  "/create",
  authentication,
  authorizer(["admin"]),
  uploadProfileImage.single("profileImage"),
  createUser
);
//đăng nhập
userRouter.post("/login", handleLogin);
//xem danh sách người dùng
userRouter.get(
  "/getAllUser",
  authentication,
  authorizer(["admin"]),
  getAllUser
);
//xem chi tiết người dùng(phải đăng nhập mới xem được)
userRouter.get("/:id", authentication, getAccount);
//cập nhật thông tin người dùng quyền admin
userRouter.put(
  "/admin/:id",
  authentication,
  authorizer(["admin"]),
  uploadProfileImage.single("profileImage"),
  updateUserByAdmin
);

module.exports = userRouter;
