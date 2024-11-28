const express = require("express");
const {
  createUser,
  handleLogin,
  getAllUser,
  getAccount,
  updateUser,
  changePassword,
  deleteUser,
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
userRouter.get("/:email", authentication, getAccount);
//cập nhật thông tin người dùng quyền admin
userRouter.put(
  "/admin/:id",
  authentication,
  authorizer(["admin"]),
  uploadProfileImage.single("profileImage"),
  updateUser
);
//cập nhật thông tin cá nhân
userRouter.put(
  "/:id",
  authentication,
  uploadProfileImage.single("profileImage"),
  updateUser
);
// Đổi mật khẩu
userRouter.post("/password", authentication, changePassword);
// xóa người dùng
userRouter.delete("/:id", authentication, authorizer(["admin"]), deleteUser);

module.exports = userRouter;
