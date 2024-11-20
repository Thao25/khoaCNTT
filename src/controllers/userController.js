const { createUserService, loginService, getUserService, getAccountService, updateUserByAdminService} = require("../services/userService");
const User = require("../models/user");
const createUser = async(req, res) => {
   
    const { email, password, role, fullName, gender, address, phoneNumber, dateOfBirth,studentClass , description } = req.body;
   
    if (!email || !password || !role || !fullName ) {
        return res.status(400).json({ message: 'Thiếu các trường bắt buộc' });
    }
    const existingUser = await User.findOne({ email }); 
    if (existingUser) {
        return res.status(400).json({ message: 'Email đã tồn tại, vui lòng chọn email khác' });
    }
    
    const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null; // Chuyển dấu \ thành /
    const data = await createUserService(email, password, role, fullName, imagePath, gender, address, phoneNumber, dateOfBirth,studentClass, description);
    const fullImageUrl = imagePath ? `${req.protocol}://${req.get('host')}/${imagePath}` : null;
    if(!data) return res.status(500).json({message: "Error creating user"});
    return res.status(200).json({message: "User created successfully", data: { ...data.toObject(), profileImage: fullImageUrl }});

};
const handleLogin = async(req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    return res.status(200).json(data);
};
const getAllUser = async(req, res) => {
    const data = await getUserService();
    const dataWithUrl =data.map(user => {
       const fullImageUrl = user.profileImage ? `${req.protocol}://${req.get('host')}/${user.profileImage}` : null;
       return { ...user.toObject(), profileImage: fullImageUrl };
    });
   
    return res.status(200).json({ message: 'List of users', data: dataWithUrl });
};
const getAccount = async(req, res) => { 
    const id = req.params.id;
    const data = await getAccountService(id);
    const fullImageUrl = data.profileImage ? `${req.protocol}://${req.get('host')}/${data.profileImage}` : null;
    return res.status(200).json({ message: 'User details', data: { ...data.toObject(), profileImage: fullImageUrl } });
};

const updateUserByAdmin = async (req, res) => {
    const id = req.params.id; // Lấy id người dùng từ params
    const { email, fullName, address, phoneNumber, gender, dateOfBirth, studentClass, description } = req.body;
    
    // Kiểm tra xem có file ảnh không, nếu không thì giữ lại ảnh cũ
    const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

    try {
        // Lấy người dùng hiện tại từ database để lấy ảnh cũ nếu không có ảnh mới
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Nếu không có ảnh mới thì giữ ảnh cũ
        const updatedImagePath = imagePath ? imagePath : User.profileImage; // Giữ ảnh cũ nếu không có ảnh mới

        // Cập nhật thông tin người dùng
        const updatedUser = await updateUserByAdminService(id, {
            email,
            fullName,
            profileImage: updatedImagePath, // Cập nhật ảnh nếu có
            address,
            phoneNumber,
            gender,
            dateOfBirth,
            studentClass,
            description
        });

        // Tạo URL đầy đủ cho ảnh
        const fullImageUrl = updatedImagePath ? `${req.protocol}://${req.get('host')}/${updatedImagePath}` : null;

        // Kiểm tra nếu cập nhật không thành công
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found or unable to update' });
        }

        // Trả về kết quả
        return res.status(200).json({
            message: 'User updated successfully',
            data: {
                ...updatedUser.toObject(),
                profileImage: fullImageUrl // Gửi URL đầy đủ cho ảnh
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating user information', error });
    }
};


module.exports = {
    createUser, handleLogin, getAllUser, getAccount, updateUserByAdmin

}
