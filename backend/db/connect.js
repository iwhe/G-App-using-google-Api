import mysql from "mysql2/promise";

const connectDB = async () => {
  try {
    const pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    return pool;
  } catch (error) {
    console.log("DB connection failed!", error);
    process.exit(1);
  }
};

export default connectDB;
