import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function login({ user, token }) {
    localStorage.setItem("token", token);
    setCurrentUser(user);
    setLoading(false);
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem("token");
    setLoading(false);
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/user/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Response from fetchUser:", response);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Data from fetchUser:", data.user);
          setCurrentUser(data.user);
        } catch (error) {
          console.log("Failed to fetch user:", error);
          console.error("Error details:", error.message);
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
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
