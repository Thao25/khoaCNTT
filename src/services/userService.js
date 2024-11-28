const express = require("express");
require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const e = require("express");
const saltRounds = 10;
const fs = require("fs");
const path = require("path");
const createUserService = async (
  email,
  password,
  role,
  fullName,
  profileImage,
  gender,
  address,
  phoneNumber,
  dateOfBirth,
  studentClass,
  description
) => {
  try {
    console.log("Dữ liệu đầu vào:", {
      email,
      password,
      role,
      fullName,
      profileImage,
      gender,
      address,
      phoneNumber,
      dateOfBirth,
      studentClass,
      description,
    });
    //hash user password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    //save user to database
    let result = await User.create({
      email: email,
      password: hashPassword,
      role: role,
      fullName: fullName,
      profileImage: profileImage,
      gender: gender,
      address: address,
      phoneNumber: phoneNumber,
      dateOfBirth: dateOfBirth,
      studentClass: studentClass,
      description: description,
    });
    result.profileImage = `${process.env.BASE_URL}/${result.profileImage}`;
    console.log(result.profileImage);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const loginService = async (email, password) => {
  try {
    // fetch user by email
    const user = await User.findOne({ email: email });
    if (user) {
      // compare password
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: "Email/Password không đúng",
        };
      } else {
        //  create an access token
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
        };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        return {
          EC: 0,
          EM: "OK",
          access_token,
          user: {
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
          },
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email/Password không đúng",
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserService = async () => {
  try {
    let result = await User.find({});
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const getAccountService = async (email) => {
  try {
    const result = await User.findOne({ email });
    // if (!result) {
    //   return null;
    // }
    console.log("result", result);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateUserService = async (id, userData) => {
  try {
    // Cập nhật thông tin người dùng, không thay đổi mật khẩu
    const result = await User.findByIdAndUpdate(id, userData, { new: true });
    if (result && result.profileImage) {
      result.profileImage = `${process.env.BASE_URL}/${result.profileImage}`;
    }
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const changePasswordService = async (email, oldPassword, newPassword) => {
  try {
    // Kiểm tra xem mật khẩu cũ và mật khẩu mới có hợp lệ không
    if (!oldPassword || !newPassword) {
      return {
        EC: 1,
        EM: "Cần phải cung cấp cả mật khẩu cũ và mật khẩu mới.",
      };
    }

    // Tìm người dùng từ cơ sở dữ liệu
    const user = await User.findOne({ email });
    if (!user) {
      return {
        EC: 2,
        EM: "Người dùng không tìm thấy.",
      };
    }

    // So sánh mật khẩu cũ với mật khẩu trong cơ sở dữ liệu
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return {
        EC: 3,
        EM: "Mật khẩu cũ không đúng.",
      };
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    user.password = hashedNewPassword;
    await user.save();

    return {
      EC: 0,
      EM: "Đổi mật khẩu thành công.",
    };
  } catch (error) {
    console.error("Error changing password in service:", error);
    return {
      EC: 4,
      EM: "Đã có lỗi xảy ra trong quá trình đổi mật khẩu.",
    };
  }
};

const deleteUserService = async (id) => {
  try {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return null;
    }
    // xóa ảnh đại diện nếu có
    if (result.profileImage) {
      const imagePath = path.resolve(__dirname, "../../", result.profileImage);
      console.log("imagePath", imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Image deleted:", imagePath);
      } else {
        console.log("Image not found:", imagePath);
      }
    }
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
  getAccountService,
  updateUserService,
  changePasswordService,
  deleteUserService,
};
