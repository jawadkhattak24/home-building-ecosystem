import React, { useState } from "react";
import styles from "./styles/login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import axios from "redaxios";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { useLoading } from "../../contexts/loadingContext";

export default function LoginPage() {
  const { login } = useAuth();
  const { setIsLoading, isLoading, LoadingUI } = useLoading();
  const [showPassword, setShowPassword] = useState(false);

  const [errorStatus, setErrorStatus] = useState({
    email: false,
    password: false,
    googleId: false,
  });

  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`;
  };

  const handleFacebookLogin = () => {
    setIsLoading(true);
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/auth/facebook/login`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorStatus({ email: false, password: false });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        userData
      );

      const { user, token } = await res.data;
      console.log("Server response status:", res.status);

      if (res.status === 200) {
        login(user, token);
        navigate("/homeNew");
      } else if (res.status === 500) {
        setErrorStatus({ email: false, password: false });
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (err) => {
    if (!err) {
      console.error("Network error. Please try again later.");
      return;
    }

    const { status, data } = err;

    if (status === 400) {
      if (data.msg === "Incorrect email") {
        setErrorStatus({ email: true, password: false });
      } else if (data.msg === "Incorrect password") {
        setErrorStatus({ email: false, password: true });
      } else if (data.msg === "Login with Google") {
        setErrorStatus({ googleId: true });
      }
    } else if (status === 500) {
      setErrorStatus({ email: false, password: false });
    } else {
      console.error("Error during login:", err);
    }
  };

  return (
    <React.Fragment>
      {isLoading && LoadingUI}
      <div className={styles.signIn_wrapper}>
        {isLoading && (
          <div className={styles.loadingWrapper}>
            <div className={styles.loader}></div>
            <p className={styles.loadingText}>Logging in...</p>
          </div>
        )}
        <div className={styles.parent_cont}>
          <div className={styles.main_content_container}>
            <div className={styles.logo_container}>
              <Link to="/" className={styles.logo_link}>
                <h2 className={styles.login_logo}>Home Building Ecosystem</h2>
              </Link>
              <h4 className={styles.h4}>Login Now</h4>
            </div>
            <div className={styles.input_container_wrapper}>
              <div className={styles.input_container}>
                <input
                  className={` ${styles.input} ${
                    errorStatus.email ? styles.input_error : ""
                  }`}
                  type="text"
                  placeholder="Email"
                  name="email"
                  onChange={handleChange}
                />
                {errorStatus.email && (
                  <p className={styles.errorText}>
                    Email is incorrect. Please try again.
                  </p>
                )}
                <div className={styles.passwordWrapper}>
                  <input
                    className={` ${styles.input} ${
                      errorStatus.password ? styles.input_error : ""
                    }`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errorStatus.password && (
                  <p className={styles.errorText}>
                    Password is incorrect. Please try again.
                  </p>
                )}
              </div>

              <div className={styles.misc_fields}>
                <a className={styles.forgetPassLink} href="/forgetPassword">
                  Forgot password?
                </a>
              </div>
              {errorStatus.googleId && (
                <p className={styles.errorText}>Please login with Google.</p>
              )}

              <div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={styles.button_primary}
                >
                  Login
                </button>
              </div>
            </div>

            <div className={styles.or_container}>
              <div className={styles.line}></div>
              <div className={styles.or_text}>or</div>
              <div className={styles.line}></div>
            </div>

            <div className={styles.social_login_container}>
              <button
                className={styles.socialButton}
                onClick={handleGoogleLogin}
              >
                <FaGoogle className={styles.socialIcon} />
                Continue with Google
              </button>
              <button
                className={styles.socialButton}
                onClick={handleFacebookLogin}
              >
                <FaFacebookF className={styles.socialIcon} />
                Continue with Facebook
              </button>
            </div>

            <div className={styles.register_link_container}>
              <Link to="/register">Dont have an account? Register</Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
