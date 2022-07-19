const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 2,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
