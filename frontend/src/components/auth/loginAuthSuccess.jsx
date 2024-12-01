import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import axios from "redaxios";
import { useLoading } from "../../contexts/loadingContext";

export default function LoginAuthSuccess() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isLoading, setIsLoading, LoadingUI } = useLoading();

  useEffect(() => {
    const authenticateUser = async () => {
      setIsLoading(true);
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

        console.log("User object in authRedirect", res.data.user);
        console.log("User type in authRedirect", res.data.user.userType);
      } catch (err) {
        console.error("Error during authentication:", err);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    authenticateUser();
  }, [login, navigate, setIsLoading]);

  return (
    <>
      {isLoading && LoadingUI()}
      {!isLoading && <p>Redirecting...</p>}
    </>
  );
}