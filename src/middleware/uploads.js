const multer = require("multer");
const fs = require("fs");

// Hàm tạo thư mục lưu trữ nếu chưa tồn tại
const ensureUploadDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Middleware upload ảnh
const uploadImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = "./uploads/courses/images";
      ensureUploadDirExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file ảnh: 5MB
});

// Middleware upload tài liệu
const uploadDocument = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = "./uploads/courses/documents";
      ensureUploadDirExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // Giới hạn kích thước file tài liệu: 20MB
});
// Middleware upload ảnh avatar
const uploadProfileImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = "./uploads/users/images";
      ensureUploadDirExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file ảnh: 5MB
});

module.exports = { uploadImage, uploadDocument, uploadProfileImage };
