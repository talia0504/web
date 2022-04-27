import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: 'String',
    required: [true, 'please insert your email'],
    unique: true,
  },
  password: {
    type: 'String',
    required: [true, 'please insert your password'],
    minLength: 8,
    select: false,
  },
  refreshToken: {
    type: 'String',
  },
});

export = mongoose.model("User", userSchema);
