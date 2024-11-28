require("dotenv").config();
const express = require("express");
const configViewEngine = require("./config/viewEngine");
const userRouter = require("./routes/users");
const courseRouter = require("./routes/courses");
const connection = require("./config/database");
const cors = require("cors");
const path = require("path");
const authentication = require("./middleware/authentication");

const app = express();
const port = process.env.PORT || 8080;

// Cấu hình thư mục `uploads` để có thể truy cập từ frontend
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//config req.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

// config cors
app.use(cors());

//config template engine
configViewEngine(app);

//khai báo route
app.use("/courses/", courseRouter);
app.use("/users/", userRouter);

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
