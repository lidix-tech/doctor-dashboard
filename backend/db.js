import mysql from "mysql2";
import "dotenv/config";
import fs from "fs";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    ca: fs.readFileSync("./ca.pem"),
    rejectUnauthorized: true,
  },
});

// db.promise().query("SELECT DATABASE() AS database_name, @@hostname AS host")
//   .then(([rows]) => {
//     console.log("Database:", rows[0].database_name);
//     console.log("Host:", rows[0].host);
//   })
//   .catch((err) => {
//     console.error("Database check failed:", err);
//   });

export default db.promise();
