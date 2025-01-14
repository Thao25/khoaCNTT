const {
  createUserService,
  loginService,
  getUserService,
  getAccountService,
  updateUserService,
  changePasswordService,
  deleteUserService,
  updateService,
} = require("../services/userService");
const User = require("../models/user");
const createUser = async (req, res) => {
  const {
    email,
    password,
    role,
    fullName,
    gender,
    address,
    phoneNumber,
    dateOfBirth,
    studentClass,
    description,
    MSV,
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Email đã tồn tại, vui lòng chọn email khác" });
  }

  const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null; // Chuyển dấu \ thành /
  const data = await createUserService(
    email,
    password,
    role,
    fullName,
    imagePath,
    gender,
    address,
    phoneNumber,
    dateOfBirth,
    studentClass,
    description,
    MSV
  );
  const fullImageUrl = imagePath
    ? `${req.protocol}://${req.get("host")}/${imagePath}`
    : null;
  if (!data)
    return res
      .status(500)
      .json({ message: "Lỗi trong quá trình tạo người dùng" });
  return res.status(200).json({
    message: "Tạo người dùng thành công",
    data: { ...data.toObject(), profileImage: fullImageUrl },
  });
};
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  const data = await loginService(email, password);
  if (data.EC !== 0) {
    return res.status(400).json({
      message: data.EM,
      EC: data.EC,
      EM: data.EM,
    });
  }

  return res.status(200).json({
    message: "Đăng nhập thành công",
    data,
  });
};
const getAllUser = async (req, res) => {
  const data = await getUserService();
  const dataWithUrl = data.map((user) => {
    const fullImageUrl = user.profileImage
      ? `${req.protocol}://${req.get("host")}/${user.profileImage}`
      : "https://th.bing.com/th?id=OIP.xyVi_Y3F3YwEIKzQm_j_jQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2";
    return { ...user.toObject(), profileImage: fullImageUrl };
  });

  return res
    .status(200)
    .json({ message: "Danh sách người dùng", data: dataWithUrl });
};
const getAccount = async (req, res) => {
  const email = req.user.email;
  const data = await getAccountService(email);
  if (!data)
    return res.status(404).json({ message: "Không tìm thấy người dùng" });
  const fullImageUrl = data.profileImage
    ? `${req.protocol}://${req.get("host")}/${data.profileImage}`
    : "https://th.bing.com/th?id=OIP.xyVi_Y3F3YwEIKzQm_j_jQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2";
  return res.status(200).json({
    message: "Thông tin người dùng",
    data: { ...data.toObject(), profileImage: fullImageUrl },
  });
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const {
    email,
    fullName,
    address,
    phoneNumber,
    gender,
    role,
    dateOfBirth,
    studentClass,
    description,
    MSV,
  } = req.body;

  // Kiểm tra xem có file ảnh không, nếu không thì giữ lại ảnh cũ
  const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

  try {
    // Lấy người dùng hiện tại từ database để lấy ảnh cũ nếu không có ảnh mới
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Nếu không có ảnh mới thì giữ ảnh cũ
    const updatedImagePath = imagePath ? imagePath : User.profileImage;

    // Cập nhật thông tin người dùng
    const updatedUser = await updateUserService(id, {
      email,
      fullName,
      profileImage: updatedImagePath,
      address,
      phoneNumber,
      gender,
      role,
      dateOfBirth,
      studentClass,
      description,
      MSV,
    });

    // Tạo URL đầy đủ cho ảnh
    const fullImageUrl = updatedImagePath
      ? `${req.protocol}://${req.get("host")}/${updatedImagePath}`
      : null;

    // Kiểm tra nếu cập nhật không thành công
    if (!updatedUser) {
      return res.status(404).json({ message: "Người dùng chưa được cập nhật" });
    }

    // Trả về kết quả
    return res.status(200).json({
      message: "Cập nhật người dùng thành công",
      data: {
        ...updatedUser.toObject(),
        profileImage: fullImageUrl,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Lỗi trong quá trình cập nhật người dùng", error });
  }
};
const update = async (req, res) => {
  const email = req.params.email;
  const {
    fullName,
    address,
    phoneNumber,
    gender,
    role,
    dateOfBirth,
    studentClass,
    description,
    MSV,
  } = req.body;

  // Kiểm tra xem có file ảnh không, nếu không thì giữ lại ảnh cũ
  const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

  try {
    // Lấy người dùng hiện tại từ database để lấy ảnh cũ nếu không có ảnh mới
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Nếu không có ảnh mới thì giữ ảnh cũ
    const updatedImagePath = imagePath ? imagePath : User.profileImage;

    // Cập nhật thông tin người dùng
    const updatedUser = await updateService(email, {
      fullName,
      profileImage: updatedImagePath,
      address,
      phoneNumber,
      gender,
      role,
      dateOfBirth,
      studentClass,
      description,
      MSV,
    });

    // Tạo URL đầy đủ cho ảnh
    const fullImageUrl = updatedImagePath
      ? `${req.protocol}://${req.get("host")}/${updatedImagePath}`
      : null;

    // Kiểm tra nếu cập nhật không thành công
    if (!updatedUser) {
      return res.status(404).json({ message: "Người dùng chưa được cập nhật" });
    }

    // Trả về kết quả
    return res.status(200).json({
      message: "Cập nhật người dùng thành công",
      data: {
        ...updatedUser.toObject(),
        profileImage: fullImageUrl,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Lỗi trong quá trình cập nhật người dùng", error });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const email = req.user.email; // Lấy userId từ thông tin người dùng đã được xác thực (từ JWT)
  try {
    // Gọi service để xử lý logic đổi mật khẩu
    const result = await changePasswordService(email, oldPassword, newPassword);
    if (result.EC !== 0) {
      return res.status(400).json({
        EC: result.EC,
        EM: result.EM,
      });
    }

    // Trả về kết quả từ service
    return res.status(200).json({ success: true, message: result.EM });
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(500).json({
      EC: 4,
      EM: "Đã có lỗi xảy ra trong quá trình xử lý yêu cầu.",
    });
  }
};
const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser = await deleteUserService(id);
    return res.status(200).json({
      success: true,
      message: "Xóa người dùng thành công",
    });
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(500).json({
      EC: 4,
      EM: "Đã có lỗi xảy ra trong quá trình xử lý yêu cầu.",
    });
  }
};

//cập nhật trạng thái người dùng
const updateUserStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const isActive = req.body.isActive;
    if (typeof isActive !== "boolean") {
      console.log("st", isActive);
      return res
        .status(400)
        .json({ message: "Trạng thái isActive phải là boolean" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(500).json({
      EC: 4,
      EM: "Đã có lỗi xảy ra trong quá trình xử lý yêu cầu.",
    });
  }
};

module.exports = {
  createUser,
  handleLogin,
  getAllUser,
  getAccount,
  updateUser,
  changePassword,
  deleteUser,
  updateUserStatus,
  update,
};
