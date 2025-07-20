import mongoose from "mongoose";

// Because we are using mongoose we will connect to our MongoDB Atlas using the ODM
const connectDB = async (): Promise<void> => {
  const connectionString: string = process.env.DB_STRING ?? '';
  try {
    await mongoose.connect(connectionString);
    console.log('Database connected')
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Database not connected ${error.message}`);
      throw new Error(error.message);
    }
  }
};

export default connectDB;
