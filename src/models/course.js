const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
  level: {
    type: String,
    required: true,
    enum: ["Đại cương", "Cơ sở ngành", "Chuyên ngành"],
  },
  documents: [String],
  createdAt: { type: Date, default: Date.now },
});
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
