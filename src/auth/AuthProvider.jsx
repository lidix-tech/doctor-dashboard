import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_URL = "https://doctor-dashboard-n5qi.onrender.com";

function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  //we gonna make a api fetch that shall work in every component
  //so they dont gotta check for a token bythem selves each time
  //its like modiyfing the fetch functions

  async function apiFetch(url, options = {}) {
    //try with the current token
    const response = await fetch(API_URL + url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    //now if access token is valid
    if (response.status !== 401) {
      //carry on
      return response;
    }

    //acess token is expired
    const newAccessToken = await refreshAccessToken();

    //Refresh failed
    if (!newAccessToken) {
      return response;
    }

    // Retry the original request with the new access token
    return fetch(API_URL + url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }

  async function refreshAccessToken() {
    try {
      const response = await fetch(API_URL + "/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setAccessToken(null);
        setLoggedIn(false);
        return null;
      }

      setAccessToken(data.accessToken);
      setLoggedIn(true);

      return data.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      setAccessToken(null);
      setLoggedIn(false);
      return null;
    }
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error("Authentication check failed:", error);
        setLoggedIn(false);
      } finally {
        setAuthChecking(false);
      }
    }

    checkAuth();
  }, []);

  async function logout() {
    try {
      await fetch(API_URL + "/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Clear React authentication state
    setAccessToken(null);
    setLoggedIn(false);
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        loggedIn,
        setLoggedIn,
        authChecking,
        setAuthChecking,
        logout,
        apiFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default AuthProvider;
