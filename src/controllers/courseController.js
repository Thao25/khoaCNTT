const courseService = require('../services/courseService');
const Course = require('../models/course');

const createCourse = async(req, res) => {
    try {
   const { name, description,  level } = req.body;
   console.log(req.body);
   console.log(req.file);
   // Kiểm tra các trường bắt buộc
   if (!name || !description || !level ) {
    return res.status(400).json({ message: 'Thiếu các trường bắt buộc' });
}
const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null; 

   const course = await courseService.createCourse(name, description, imagePath, level);

   const fullImageUrl = imagePath ? `${req.protocol}://${req.get('host')}/${imagePath}` : null;

   res.status(201).json({ 
        message: 'Tạo khóa học thành công',
        data: { ...course.toObject(), 
        image: fullImageUrl,
    } });

   } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Lỗi trong quá trình tạo khóa học' });
   }
};

const getAllCourses = async (req, res) => {
    const courses = await courseService.getAllCourses();    
    const coursesWithUrls = courses.map(course => {
    const fullImageUrl = course.image ? `${req.protocol}://${req.get('host')}/${course.image}` : null;
    const fullDocumentUrls = course.documents ? course.documents.map(doc => `${req.protocol}://${req.get('host')}/uploads/courses/documents/${doc}`) : [];
    return{ ...course.toObject(), image: fullImageUrl, documents: fullDocumentUrls };
    });
   
    res.status(200).json({ message: 'Danh sách khóa học', data: coursesWithUrls });
};

const getCourseById = async (req, res) => {
    const id = req.params.id;
    const course = await courseService.getCourseById(id);
    if (course) {
        const  fullImageUrl = course.image ? `${req.protocol}://${req.get('host')}/${course.image}` : null;
        const fullDocumentUrls = course.documents ? course.documents.map(doc => `${req.protocol}://${req.get('host')}/uploads/courses/documents/${doc}`) : [];
        res.status(200).json({ message: 'Chi tiết khóa học',
             data: { ...course.toObject(), image: fullImageUrl, documents: fullDocumentUrls }  });
    } else {
        res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
};

const updateCourse = async (req, res) => {
    const id = req.params.id;
 const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null; 
    const { name, description, level} = req.body;
    console.log('req.body', req.body);     
   const course = await Course.findById(id);

   if (!course) {
    return res.status(404).json({ message: 'Không tìm thấy khóa học' });
}
const updatedImagePath = imagePath ? imagePath : course.image;

   const updatedCourse = await courseService.updateCourse(id, { name, description, level , image: updatedImagePath});
   console.log(updatedCourse);
   const fullImageUrl = imagePath ? `${req.protocol}://${req.get('host')}/${imagePath}` : course.image;
   if ( !updatedCourse) {
        return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }        
    res.status(200).json({ message: 'Cập nhật khóa học thành công', data: { ...updatedCourse.toObject(), image: fullImageUrl } });
    
};



const deleteCourse = async (req, res) => {
        const id = req.params.id;    
        const deletedCourse = await courseService.deleteCourse(id);
       
        if (deletedCourse) {
        res.status(200).json({ message: 'Xóa khóa học thành công' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }
    };

    const addDocuments = async (req, res) => {
        try {
            const { courseId } = req.params;
            const documents = req.files.map(file => file.filename); 
    
            // Gọi service để thêm tài liệu vào khóa học
            const updatedCourse = await courseService.addDocumentsToCourse(courseId, documents);
    
            // Gắn link đầy đủ cho ảnh (nếu có)
            const fullImageUrl = updatedCourse.image
                ? `${req.protocol}://${req.get('host')}/${updatedCourse.image}`
                : null;
    
            // Gắn link đầy đủ cho các tài liệu
            const documentUrls = updatedCourse.documents.map(doc => `${req.protocol}://${req.get('host')}/uploads/courses/documents/${doc}`);
    
            // Trả về thông tin khóa học đã cập nhật với link ảnh và tài liệu đầy đủ
            res.status(200).json({
                message: 'Thêm tài liệu vào khóa học thành công',
                course: {
                    ...updatedCourse._doc, 
                    image: fullImageUrl, 
                    documents: documentUrls, 
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi trong quá trình thêm tài liệu vào khóa học' });
        }
    };
    
module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    addDocuments
};