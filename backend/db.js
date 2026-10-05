import mysql from "mysql2";
import "dotenv/config";//dont think this is a good idea ngl


const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "patient_care_app",
  port: 3306,
});

export default db.promise();
