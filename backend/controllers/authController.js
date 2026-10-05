import crypto from "crypto";
import db from "../db.js";
import bcrypt from "bcrypt";
import {
  createAccessToken,
  createRefreshToken,
} from "../tokenUtils/tokenUtils.js";
import { verifyRefreshToken } from "../tokenUtils/tokenUtils.js";

//GET OTP

export async function sendOtp(req, res) {
  try {
    const { phone_number } = req.body;

    //my sql query
    const [result] = await db.query(
      "SELECT doctor_id FROM doctor WHERE phone_number = ?",
      [phone_number],
    );

    //if no doctors exist
    if (result.length === 0) {
      return res.status(404).json({
        message: "No doctor found with this phone number",
      });
    }

    // res.json({
    //   message: "Doctor found",
    //   doctor_id: result[0].doctor_id,
    // });

    //now if a doc exists do this
    const doctor_id = result[0].doctor_id;
    // const otp = Math.floor(100000 + Math.random() * 900000);

    const otp = crypto.randomInt(100000, 1000000);
    const otpHash = await bcrypt.hash(otp.toString(), 10);
    console.log("Development OTP:", otp);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store OTP
    await db.query(
      `INSERT INTO otp_verification
      (doctor_id, otp, expires_at)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        otp = VALUES(otp),
        expires_at = VALUES(expires_at),
        created_at = CURRENT_TIMESTAMP`,
      [doctor_id, otpHash, expiresAt],
    );

    //temporary log to console
    console.log("Doctor:", doctor_id);
    console.log("Generated OTP:", otp);
    console.log("Expires:", expiresAt);

    //our response
    res.json({
      message: "OTP generated and stored",
    });
  } catch (error) {
    //in case of server unexpected error
    console.error(error);

    res.status(500).json({
      message: "Database error",
    });
  }
}

//LOGIN
export async function login(req, res) {
  try {
    const { phone_number, otp, registration_number } = req.body;

    // 1. Find doctor using phone number + registration number
    const [doctorResult] = await db.query(
      `SELECT doctor_id
             FROM doctor
             WHERE phone_number = ?
             AND registration_number = ?`,
      [phone_number, registration_number],
    );

    if (doctorResult.length === 0) {
      return res.status(401).json({
        message: "Invalid doctor details",
      });
    }

    const doctor_id = doctorResult[0].doctor_id;

    // 2. Find OTP belonging to this doctor
    const [otpResult] = await db.query(
      `SELECT otp, expires_at
             FROM otp_verification
             WHERE doctor_id = ?`,
      [doctor_id],
    );

    if (otpResult.length === 0) {
      return res.status(401).json({
        message: "No OTP found",
      });
    }

    const storedOtp = otpResult[0].otp;
    const expiresAt = otpResult[0].expires_at;

    // 3. Check whether OTP matches
    const otpMatches = await bcrypt.compare(otp.toString(), storedOtp);

    if (!otpMatches) {
      return res.status(401).json({
        message: "Invalid OTP",
      });
    }

    // 4. Check whether OTP has expired
    const isExpired = new Date() > new Date(expiresAt);

    if (isExpired) {
      return res.status(401).json({
        message: "OTP has expired",
      });
    }

    // 5. Everything passed now issue the tokens
    // res.json({
    //   message: "Login successful",
    // });

    //----------------------------------------------------------//
    //NOW CREATE THEM TOKENS
    // Everything passed — create authentication tokens

    const accessToken = createAccessToken(doctor_id);
    const refreshToken = createRefreshToken(doctor_id);

    // Hash the refresh token before storing it in the database
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    // Store the hashed refresh token
    await db.query(
      `INSERT INTO refresh_tokens
    (doctor_id, token_hash, expires_at)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
        token_hash = VALUES(token_hash),
        expires_at = VALUES(expires_at),
        created_at = CURRENT_TIMESTAMP`,
      [doctor_id, tokenHash, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)],
    );

    // Put the actual refresh token in an HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send the access token back to React
    await db.query(
      `DELETE FROM otp_verification
   WHERE doctor_id = ?`,
      [doctor_id],
    );

    res.json({
      message: "Login successful",
      accessToken: accessToken,
    });
    //------------------------------------------------------------
    //loggin in invalidates the previous token
    //if u log into onde device
    //loggin on the second device
    //would replace the first devices token
    //therfore this is temporary
    //  / \
    //   |
    //Day 2-----------------
    //no this is not temporary its good dumass
    //make the feature of checking is the access token good tho
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
}
export async function refresh(req, res) {
  //2 jobs
  //access token expired give me another one
  //i just opened/refreshed the app so let me stay on the dashboard omg
  //On verification of the refresh token, we create an access token.
  try {
    const refreshToken = req.cookies.refreshToken;

    //the checkers
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token in cookie" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const doctor_id = decoded.doctor_id;

    const [result] = await db.query(
      `SELECT token_hash, expires_at
       FROM refresh_tokens
       WHERE doctor_id = ?`,
      [doctor_id],
    );

    if (result.length === 0) {
      return res.status(401).json({
        message: "Refresh token not found in database",
      });
    }

    const storedToken = result[0];
    if (new Date() > new Date(storedToken.expires_at)) {
      return res.status(401).json({
        message: "Refresh token has expired",
      });
    }

    //Compare browsers refresh token
    //against the hash stored in MySQL
    const tokenMatches = await bcrypt.compare(
      refreshToken,
      storedToken.token_hash,
    );

    if (!tokenMatches) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    //if all conditions PASS YIPEEE OMG ITS OVER

    const newAccessToken = createAccessToken(doctor_id);
    return res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });

    ///now refresh the browser
    //cant have 2 res.jsons
  }
}
export async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    //no cookie
    if (!refreshToken) {
      return res.json({ message: "Already logged out" });
    }

    //get doctor id from current refresh token
    const decoded = verifyRefreshToken(refreshToken);
    const doctor_id = decoded.doctor_id;

    //delete the stored token
    await db.query(
      `DELETE FROM refresh_tokens
       WHERE doctor_id = ?`,
      [doctor_id],
    );

    //remove the token from the browser by emptying the cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({ message: "Logout complete" });
  } catch (error) {
    console.error(error);

    // Even if the token is invalid/expired,
    // remove the browser cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({
      message: "Logout successful",
    });
  }
}
