import express from "express";
import { sendOtp, login, refresh,logout} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout",logout);

export default router;
