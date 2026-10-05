import { verifyAccessToken } from "../tokenUtils/tokenUtils.js";

export function authenticate(req, res, next) {
  // console.log("the authenticate function is getting called");
  // Get the Authorization header
  const authHeader = req.headers.authorization;

  // Make sure the header exists
  if (!authHeader) {
    return res.status(401).json({
      message: "No authorization header",
    });
  }

  // Authorization header looks like:
  // "Bearer eyJhbGciOiJIUzI1Ni..."
  const token = authHeader.split(" ")[1];

  // Make sure we actually got a token
  if (!token) {
    return res.status(401).json({
      message: "No access token",
    });
  }

  try {
    // Verify the JWT using the function you already created
    const decoded = verifyAccessToken(token);

    // Store the information from the token on the request
    req.user = decoded;

    // Token is valid, so continue to the controller
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired access token",
      
    });
  }
} //bleh bleh bleh
