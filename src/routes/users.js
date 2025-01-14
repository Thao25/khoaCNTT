const express = require("express");
const {
  createUser,
  handleLogin,
  getAllUser,
  getAccount,
  updateUser,
  changePassword,
  deleteUser,
  update,
  updateUserStatus,
} = require("../controllers/userController");
const authentication = require("../middleware/authentication");
const authorizer = require("../middleware/authorization");
const userRouter = express.Router();
const delay = require("../middleware/delay");
const { uploadProfileImage } = require("../middleware/uploads");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
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
userRouter.get("/all", authentication, authorizer(["admin"]), getAllUser);
//xem chi tiết người dùng(phải đăng nhập mới xem được)
userRouter.get("/account", authentication, delay, getAccount);
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
  "/:email",
  authentication,
  uploadProfileImage.single("profileImage"),
  update
);

// Đổi mật khẩu
userRouter.post("/password", authentication, changePassword);
// xóa người dùng
userRouter.delete("/:id", authentication, authorizer(["admin"]), deleteUser);
//cập nhật trạng thái người dùng
userRouter.put(
  "/status/:id",
  authentication,
  authorizer(["admin"]),
  updateUserStatus
);
// API Refresh Token
userRouter.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ EC: 1, EM: "Refresh token không tồn tại" });
  }

  try {
    // Giải mã refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({ EC: 2, EM: "Tài khoản không tồn tại" });
    }

    // Tạo access token mới
    const payload = {
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      profileImage: user.profileImage,
      gender: user.gender,
      address: user.address,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      studentClass: user.studentClass,
      description: user.description,
      MSV: user.MSV,
    };

    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE, // Thời gian sống mới của access token
    });
    const refresh_token = jwt.sign(
      { email: user.email },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRE, // Thời gian sống của refresh token
      }
    );
    return res.json({
      message: "Đăng nhập thành công",
      data: {
        EC: 0,
        access_token,
        refresh_token,
        user: {
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          profileImage: user.profileImage,
          gender: user.gender,
          address: user.address,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
        },
      },
    }); // Trả về access token mới
  } catch (error) {
    return res.status(401).json({ EC: 99, EM: "Refresh token không hợp lệ" });
  }
});

module.exports = userRouter;
