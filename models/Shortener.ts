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
});

const Shortener =
  mongoose.models.Shortener || mongoose.model("Shortener", ShortenerSchema);

export { Shortener };
