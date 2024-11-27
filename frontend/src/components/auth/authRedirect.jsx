import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import styles from "../../pages/login/styles/login.module.scss";
import axios from "redaxios";

export default function AuthSuccess() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (!token) {
          throw new Error("No token found in URL.");
        }

        localStorage.setItem("token", token);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        login({ user: res.data.user, token });

        navigate("/homeNew");
      } catch (err) {
        console.error("Error during authentication:", err);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    authenticateUser();
  }, [login, navigate]);

  return (
    <div className={styles.loadingWrapper}>
      {isLoading ? (
        <div>
          <div className={styles.loader}></div>
          <p className={styles.loadingText}>Authenticating...</p>
        </div>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
}
