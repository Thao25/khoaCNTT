module.exports = [
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      origin: ["http://localhost:5173"], // Thêm địa chỉ frontend của bạn
    },
  },
  // Các middleware khác
];
