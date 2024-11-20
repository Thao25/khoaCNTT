const jwt = require('jsonwebtoken');
require('dotenv').config();
const authentication = (req, res, next) => {
   
    const white_list = [ "/login"]
    if(white_list.find(item => '/users'+item === req.originalUrl)){
        next();
       
    }else{
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            //   verify token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = {
                    email: decoded.email,
                    role: decoded.role,
                    fullName: decoded.fullName,
                    profileImage: decoded.profileImage,
                    gender: decoded.gender,
                    address: decoded.address,
                    phoneNumber: decoded.phoneNumber,
                    dateOfBirth: decoded.dateOfBirth,
                    studentClass: decoded.studentClass,
                    description: decoded.description
                };
                console.log(decoded);
                next();
            } catch (error) {
                return res.status(401).json({ 
                    message: " Invalid Token" });

            }
            
                }  else {
                   return res.status(401).json({ 
                    message: " No Token" });
                }
          
        };

    }
    
   
    
module.exports = authentication;