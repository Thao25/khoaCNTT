const express = require("express");
require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const createUserService = async (email, password, role, fullName, profileImage, gender, address, phoneNumber, dateOfBirth, studentClass, description) => {
    try {
        console.log("Dữ liệu đầu vào:", { email, password, role, fullName, profileImage, gender, address, phoneNumber, dateOfBirth, studentClass, description });
        //hash user password
        const hashPassword = await bcrypt.hash(password, saltRounds);

        //save user to database
        let result = await User.create({
            email: email,
            password: hashPassword,
            role: role,
            fullName: fullName,
            profileImage: profileImage,
            gender :gender,
            address: address,
            phoneNumber:phoneNumber,
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
}


const loginService = async (email, password) => {
    try {
        // fetch user by email
        const user = await User.findOne({ email: email });
        if(user){ 
            // compare password
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if(!isMatchPassword){
                return {
                    EC: 2,
                    EM: "Email/Password incorrect"
                }
            }else {
                    //  create an access token
                    const payload = {
                        email: user.email,
                        role: user.role,
                        fullName: user.fullName,
                        profileImage: user.profileImage,
                        gender:user.gender,
                        address:user.address,
                        phoneNumber:user.phoneNumber,
                        dateOfBirth:user.dateOfBirth,
                        studentClass:user.studentClass,
                        description:user.description
                    }
                    const access_token = jwt.sign(
                        payload, 
                        process.env.JWT_SECRET,
                        {
                            expiresIn: process.env.JWT_EXPIRE
                        }
                    );

             
                    return {
                        access_token,
                     
                        user:{
                            email: user.email,
                            role: user.role,
                            fullName: user.fullName,
                            profileImage: user.profileImage,
                            gender:user.gender,
                            address:user.address,
                            phoneNumber:user.phoneNumber,
                            dateOfBirth:user.dateOfBirth,
                            studentClass:user.studentClass,
                            description:user.description
                            
                        }
                    }
                }
            }else{
            return {
                EC: 1,
                EM: "Email/Password incorrect"
            }
                }      

    } catch (error) {
        console.log(error);
        return null;
    }
}

const getUserService = async () => {
    try {
       
        let result = await User.find({});
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}
const getAccountService = async (id) => {
    try {
       
        let result = await User.findById(id);
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateUserByAdminService = async (id, userData) => {
    try {
        // Cập nhật thông tin người dùng, không thay đổi mật khẩu
        const result = await User.findByIdAndUpdate(id, userData, { new: true });
        if(result && result.profileImage){
            result.profileImage = `${process.env.BASE_URL}/${result.profileImage}`;
        }
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
};

module.exports = {
    createUserService, loginService, getUserService, getAccountService, updateUserByAdminService
}
