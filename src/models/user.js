const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["student", "lecturer", "admin"],
  },
  profileImage: { type: String },
  gender: { type: String, enum: ["Nam", "Nữ"] },
  address: { type: String },
  phoneNumber: { type: String },
  dateOfBirth: Date,

  studentClass: {
    type: String,
    required: function () {
      return this.role === "student"; // Chỉ yêu cầu nếu là sinh viên
    },
  },
  MSV: {
    type: String,
    unique: true,
    required: function () {
      return this.role === "student"; // Chỉ yêu cầu nếu là sinh viên
    },
    match: [/^CT\d{6}$/, "MSV phải bắt đầu bằng 'CT' theo sau là 6 chữ số"], // regex kiểm tra định dạng
  },

  description: {
    type: String,
    required: function () {
      return this.role === "lecturer"; // Chỉ yêu cầu nếu là giảng viên
    },
  },
  isActive: {
    type: Boolean,
    default: true, // Mặc định người dùng được kích hoạt
  },
});
timestamps = { createdAt: "created_at", updatedAt: "updated_at" };
const User = mongoose.model("user", userSchema);

module.exports = User;
