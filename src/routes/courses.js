const express = require('express');
const { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse, addDocuments} = require('../controllers/courseController');
const courseRouter = express.Router();
const {uploadImage, uploadDocument} = require('../middleware/uploads');


// console.log('uploadImage:', uploadImage);
// console.log('uploadDocument:', uploadDocument);

courseRouter.post("/create", uploadImage.single('image'), createCourse)
courseRouter.get("/all", getAllCourses)
courseRouter.get("/:id", getCourseById)
courseRouter.put("/:id", uploadImage.single('image'), updateCourse)
courseRouter.delete("/:id", deleteCourse)
courseRouter.post("/documents/:courseId", uploadDocument.array('documents'), addDocuments)


courseRouter.post('/test-upload-image', uploadImage.single('image'), (req, res) => {
    res.send('Upload ảnh thành công');
});

// Test route cho upload tài liệu
courseRouter.post('/:courseId/test-upload-documents', uploadDocument.array('documents'), (req, res) => {
    res.send('Upload tài liệu thành công');
});

module.exports = courseRouter ;