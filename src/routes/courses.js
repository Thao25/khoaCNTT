const express = require("express");
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addDocuments,
} = require("../controllers/courseController");
const courseRouter = express.Router();
const { uploadImage, uploadDocument } = require("../middleware/uploads");
const authentication = require("../middleware/authentication");
const authorizer = require("../middleware/authorization");

// tạo khóa học
courseRouter.post(
  "/create",
  authentication,
  authorizer(["admin"]),
  uploadImage.single("image"),
  createCourse
);
//xem danh sách khóa học
courseRouter.get("/all", getAllCourses);
//xem chi tiết khóa học
courseRouter.get("/:id", getCourseById);
//cập nhật thông tin khóa học
courseRouter.put(
  "/:id",
  authentication,
  authorizer(["admin"]),
  uploadImage.single("image"),
  updateCourse
);
//xóa khóa học
courseRouter.delete(
  "/:id",
  authentication,
  authorizer(["admin"]),
  deleteCourse
);
//thêm tài liệu vào khóa học
courseRouter.post(
  "/documents/:courseId",
  authentication,
  authorizer(["lecturer"]),
  uploadDocument.array("documents"),
  addDocuments
);

module.exports = courseRouter;
