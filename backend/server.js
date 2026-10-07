import express from "express";
//import db from "./db.js";
import cors from "cors";
//import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
//import bcrypt from "bcrypt";
//temp
import patientRoutes from "./routes/patientRoutes.js";

const app = express();

//const ACCESS_TOKEN_SECRET = "change-this-later";
//const REFRESH_TOKEN_SECRET = "change-this-later-too";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working bleh bleh");
});

// app.get("/test-db", async (req, res) => {
//   try {
//     const [result] = await db.query("SELECT * FROM patient");
//     res.json(result);
//    } catch (error) {
//     console.error(error);
//     res.status(500).send("Failed to fetch patients");
//   }
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//"Every time the frontend needs to perform an operation that the
// backend must handle, we create an API endpoint for it."
