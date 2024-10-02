const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ім'я користувача повинно бути унікальним
    },
    password: {
      type: String,
      required: true,
    },
    email: { type: String, require: true, unique: true },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Додає поля createdAt і updatedAt
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
