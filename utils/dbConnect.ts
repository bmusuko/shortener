import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    switch (mongoose.connection.readyState) {
      /* ready state 
        0 = disconnected 
        1 = connected 
        2 = connecting 
        3 = disconnecting 
      */
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
