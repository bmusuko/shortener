import mongoose from "mongoose";

const dbConnect = async () => {
  console.log(process.env.MONGO_URI);
  try {
    switch (mongoose.connection.readyState) {
      case 1:
      case 2:
        return;
      case 0:
      case 4:
        const db = await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
    }
  } catch (error) {
    console.error(error.message);
  }
};

export { dbConnect };
