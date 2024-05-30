import mongoose from "mongoose";

export const conncetToDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://cdxhabib:poiuuiop@cluster0.rr7ldlq.mongodb.net/mern-24?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("db conncet");
  } catch (error: any) {
    console.log(error);
    console.log("db conncet failed");
    process.exit(1);
    return new Error(error.message);
  }
};
