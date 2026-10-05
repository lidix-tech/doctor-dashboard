import "./Login.css";
// import Dashboard from "../pages/Dashboard";
import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  //our variables
  //function stores value on change in phone number
  const {
    // accessToken,
    setAccessToken,
    // loggedIn,
    setLoggedIn,
    authChecking,
  } = useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  // const [loggedIn, setLoggedin] = useState(false);
  // const [accessToken, setAccessToken] = useState(null);
  // const [authChecking, setAuthChecking] = useState(true);

  //yeahhhhhhhhhhhhhhhhhhhhhhhhh it works somehow idk how ngl
  // useEffect(() => {
  //   async function checkAuth() {
  //     try {
  //       const response = await fetch("http://localhost:5000/auth/refresh", {
  //         method: "POST",
  //         credentials: "include",
  //       });

  //       const data = await response.json();

  //       if (response.ok) {
  //         setAccessToken(data.accessToken);
  //         setLoggedin(true);
  //       } else {
  //         setLoggedin(false);
  //       }
  //     } catch (error) {
  //       console.error("Authentication check failed:", error);
  //       setLoggedin(false);
  //     } finally {
  //       setAuthChecking(false);
  //     }
  //   }

  //   checkAuth();
  // }, []);

  //our 2 functions async cause we have to use await
  async function handleGetOtp(event) {
    //casue form
    event.preventDefault();
    // console.log("Hello from function");

    try {
      //send a HTTP request to my Express back at this URL
      const response = await fetch("http://localhost:5000/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
        }),
      });

      //wait for the fetch operation to complete before going to the next line
      // const data = await response.json();
      // //log the response data
      // console.log(data);

      if (!response.ok) {
        throw new Error("Failed to request OTP");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
    }
  }

  async function handleLogin(event) {
    //cause form
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          otp: otp,
          registration_number: registrationNumber,
        }),
      });

      const data = await response.json();
      // console.log(data);

      //if our login went through set the function to true
      if (response.ok) {
        setAccessToken(data.accessToken);
        // console.log(accessToken);
        setLoggedIn(true);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }

  if (authChecking) {
    return <div>Checking authentication...</div>;
  }

  // if (loggedIn) {
  //   // setAccessToken(data.accessToken);
  //   // setLoggedIn(true);
  //   navigate("/dashboard");
  // }

  return (
    <div className="OuterLoginContainer">
      <div className="LoginContainer">
        <h1 className="MainHeader">Doctor Login</h1>
        <h3>Sign in to access your patient dashboard</h3>
        {/* MediCare Icon lol */}
        <div className="AppWords">
          <h5>HB Holistics</h5>
          <p>Pain Clinic</p>
        </div>
        {/*The 3 areas*/}
        <form>
          <div className="phone-field">
            <label>Phone Number</label>
            <br />
            <input
              className="inputs"
              type="text"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
            <button className="otp_button" onClick={handleGetOtp}>
              Get OTP
            </button>
          </div>

          <div className="otp-field">
            <label>OTP code</label>
            <br />
            <input
              className="inputs"
              id="otp"
              type="text"
              placeholder="Enter OTP code"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
            />
          </div>

          <div className="doctor-id-field">
            <label>Doctor ID/Registration Number</label>
            <br />
            <input
              className="inputs"
              id="doc"
              type="text"
              placeholder="Enter Registration Number"
              value={registrationNumber}
              onChange={(event) => setRegistrationNumber(event.target.value)}
            />
          </div>
          <button className="LoginButton" onClick={handleLogin}>
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
export default Login;
