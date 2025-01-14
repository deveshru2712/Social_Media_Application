import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.Mongo_Uri);
    console.log("successfully connected to the database ✅");
  } catch (error) {
    console.error(
      "an error occured while connecting to the database:",
      error.message
    );
    process.exit(1);
  }
};

export default connectToDb;
