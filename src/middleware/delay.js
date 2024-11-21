const delay = (req, res, next) => {
  setTimeout(() => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      console.log(token);
    }
    next(); // Tiếp tục xử lý request sau khi trì hoãn
  }, 1000);
};
module.exports = delay;
