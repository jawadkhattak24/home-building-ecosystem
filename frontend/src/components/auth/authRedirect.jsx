import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("authToken", token);

      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
};

export default AuthRedirect;
