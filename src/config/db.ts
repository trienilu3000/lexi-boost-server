import { AppDataSource } from "./ormconfig";


export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("📦 Connected to PostgreSQL database");
  } catch (error) {
    console.error("❌ Error connecting to the database", error);
    process.exit(1);
  }
};
