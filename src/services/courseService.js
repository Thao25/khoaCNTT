const Course = require('../models/course');
const path = require('path');
const fs = require('fs');


const createCourse = async(name, description, image, level) => {
    try {
       let result = await Course.create({
         name : name,
          description : description,
          image : image,
          level : level,
         });                

         result.image = `${process.env.BASE_URL}/${result.image}`;
             console.log(result.image);   
          return result;
        } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllCourses = async () => {

    try {       
        let result = await Course.find({});
                return result;        
    } catch (error) {
        console.log(error);
       return null;
    }
     
};

const getCourseById = async(id) => {
    try {
        let result = await Course.findById(id);
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const updateCourse = async (id, data) => {
   
    try {

 // Lấy khóa học hiện tại để kiểm tra sự thay đổi
 const currentCourse = await Course.findById(id);
        
 if (!currentCourse) {
     throw new Error('Course not found');
 }

 // In ra dữ liệu cũ và dữ liệu mới để kiểm tra sự thay đổi
 console.log('Current Course:', currentCourse);
 console.log('Data to Update:', data);

 // Nếu không có thay đổi gì, trả về đối tượng cũ
 if (currentCourse.name === data.name && currentCourse.description === data.description && currentCourse.level === data.level && currentCourse.image === data.image) {
     console.log('No changes detected');
     return currentCourse;  // Không có thay đổi, trả về khóa học cũ
 }


        const result = await Course.findByIdAndUpdate(id, data, { new: true });
        
        if (result && result.image) {
            result.image = `${process.env.BASE_URL}/${result.image}`;
        }
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Error updating course');
    }
};

const deleteCourse = async(id) => {
    try {
        let result = await Course.findByIdAndDelete(id);
       if(!result){
           return null;
       }
    //    Xóa ảnh liên quan đến khóa học nếu có
        if(result.image){           
            const imagePath = path.resolve(__dirname, '../../', result.image);
            console.log(imagePath);
           
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log('Image deleted:', imagePath);
            } else {
                console.log('Image not found:', imagePath);
            }
        }
        // xóa tài liệu liên quan nếu có
        if(result.documents && result.documents.length > 0){
            result.documents.forEach(document => {
                const docPath = path.resolve(__dirname, '..','..','uploads','courses','documents',document);
                if (fs.existsSync(docPath)) {
                    fs.unlinkSync(docPath);
                    console.log('Document deleted:', docPath);
                }
                else {
                    console.log('Document not found:', docPath);
                }
            })
            
        }
    return result;
    }    
    catch (error) {
        console.log(error);
    }
};


const addDocumentsToCourse = async (courseId, documents) => {
    try {
        // Tìm khóa học theo ID
        const existingCourse = await Course.findById(courseId);
        if (!existingCourse) {
            throw new Error('Course not found');
        }

        // Thêm tài liệu vào mảng documents hiện có
        existingCourse.documents = [...existingCourse.documents, ...documents];
        
        // Lưu lại thay đổi
        await existingCourse.save();

        // Trả về khóa học đã cập nhật
        return existingCourse;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to add documents to course');
    }
};


module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    addDocumentsToCourse
};