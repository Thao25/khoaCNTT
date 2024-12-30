require("dotenv").config();
const express = require("express");
const configViewEngine = require("./config/viewEngine");
const userRouter = require("./routes/users");
const courseRouter = require("./routes/courses");
const notiRouter = require("./routes/notifications");
const fs = require("fs");
const connection = require("./config/database");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;
// config cors
app.use(cors());

// Cấu hình thư mục `uploads` để có thể truy cập từ frontend
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
console.log(path.join(__dirname, "..", "uploads"));

//config req.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

app.get("/download/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(
    __dirname,
    "uploads",
    "courses",
    "documents",
    fileName
  );

  // Kiểm tra xem tệp có tồn tại không
  if (fs.existsSync(filePath)) {
    // Thiết lập headers để yêu cầu tải xuống
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/pdf");

    // Gửi tệp PDF đến client
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        res.status(500).send("Lỗi khi tải về.");
      }
    });
  } else {
    res.status(404).send("Tệp không tìm thấy.");
  }
});

//config template engine
configViewEngine(app);

//khai báo route
app.use("/courses/", courseRouter);
app.use("/users/", userRouter);
app.use("/notifications/", notiRouter);

(async () => {
  try {
    //using mongoose
    await connection();

    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
