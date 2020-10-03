import mongoose from "mongoose";

const ShortenerSchema = new mongoose.Schema({
  generated_link: {
    type: String,
    required: true,
  },
  real_link: {
    type: String,
    required: true,
  },
  updated_at: { type: Date, default: Date.now },
  is_password: {
    type: Boolean,
    default: false,
    required: true,
  },
  password: {
    type: String,
  },
  visitCount: {
    type: Number
  },
});

const Shortener =
  mongoose.models.Shortener || mongoose.model("Shortener", ShortenerSchema);

export { Shortener };
