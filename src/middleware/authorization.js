const authorize = (roles) => {
  return (req, res, next) => {
    // Kiểm tra xem người dùng đã được xác thực chưa (authentication)
    if (!req.user) {
      return res.status(401).json({ message: "bạn chưa đăng nhập" });
    }

    // Kiểm tra xem vai trò của người dùng có nằm trong danh sách roles yêu cầu không
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    // Nếu có quyền, tiếp tục xử lý
    next();
  };
};

module.exports = authorize;
