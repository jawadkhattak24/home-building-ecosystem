import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function login(userData) {
    localStorage.setItem("token", userData.token);
    setCurrentUser(userData.user);
    console.log("Current user:", currentUser);
    setLoading(false);
  }

  function loginGoogle(userData) {
    try {
      if (!userData || typeof userData !== "object") {
        throw new Error("Invalid user data provided.");
      }

      const { token, user } = userData;

      if (!token || typeof token !== "string") {
        throw new Error("Authentication token is missing or invalid.");
      }

      if (!user || typeof user !== "object") {
        throw new Error("User information is missing or invalid.");
      }

      localStorage.setItem("token", token);
      setCurrentUser(user);
      console.log("Current user:", user);
    } catch (error) {
      console.error("Failed to login with Google:", error);
      // Optionally, you can implement a user-facing notification here
      // For example, using a toast notification library
      // toast.error("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setCurrentUser(null);
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/users/user`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Response from fetchUser:", response);
          // console.log("Response status:", response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Data from fetchUser:", data.user);
          setCurrentUser(data.user);
        } catch (error) {
          console.log("Failed to fetch user:", error);
          console.error("Error details:", error.message);
          // localStorage.removeItem("token");
          // setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const value = {
    currentUser,
    login,
    loginGoogle,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
