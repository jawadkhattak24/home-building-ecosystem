import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const data = JSON.parse(decodeURIComponent(urlParams.get("data")));

    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    }
  }, []);

  return <div>Processing authentication...</div>;
};

export default AuthCallback;
