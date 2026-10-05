import jwt from "jsonwebtoken";

export function createAccessToken(doctor_id){
    return jwt.sign(
         { doctor_id: doctor_id },
         process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    )
}

export function createRefreshToken(doctor_id){
    return jwt.sign(
        { doctor_id: doctor_id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
  );
}
//idk why these 2 exist btw?
export function verifyAccessToken(token){
    return jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );
}

export function verifyRefreshToken(token){
    return jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET
    );
}