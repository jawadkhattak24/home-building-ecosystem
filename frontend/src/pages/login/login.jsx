import React, { useState } from "react";
import styles from "./styles/login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import axios from "redaxios";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
// import LoaderStyles from "../../UserProfile/styles/page.module.scss";

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState({
    email: false,
    password: false,
  });

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/user/facebook`;
  };

  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        userData,
        {
          withCredentials: true,
        }
      );
      const { user } = res.data;

      login({ user });
      navigate("/homeNew");
    } catch (err) {
      console.error("Error:", err);
      if (err.response?.data?.msg === "Incorrect email") {
        setErrorStatus({ email: true, password: false });
      } else if (err.response?.data?.msg === "Incorrect password") {
        setErrorStatus({ email: false, password: true });
      } else {
        alert("Error signing in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className={styles.signIn_wrapper}>
        {isLoading && (
          <div className={styles.loadingWrapper}>
            <div className={styles.loader}></div>
            <p className={styles.loadingText}>Logging in...</p>
          </div>
        )}
        <div className={styles.parent_cont}>
          <form
            onSubmit={handleSubmit}
            className={styles.main_content_container}
          >
            <div>
              <Link to="/" className={styles.logo_link}>
                <h2 className={styles.h2}>Home Building Ecosystem</h2>
              </Link>
              <h4 className={styles.h4}>Login Now</h4>
            </div>
            <div className={styles.input_container_wrapper}>
              <div className={styles.input_container}>
                <input
                  className={` ${styles.input} ${
                    errorStatus.username ? styles.input_error : ""
                  }`}
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handleChange}
                />
                <input
                  className={` ${styles.input} ${
                    errorStatus.password ? styles.input_error : ""
                  }`}
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                />
              </div>

              <div className={styles.misc_fields}>
                <a className={styles.forgetPassLink} href="/forgetPassword">
                  Forgot password?
                </a>
              </div>

              <div>
                <button type="submit" className={styles.button_primary}>
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
                Login with Google
              </button>
              <button
                className={styles.socialButton}
                onClick={handleFacebookLogin}
              >
                <FaFacebookF className={styles.socialIcon} />
                Login with Facebook
              </button>
            </div>

            <div className={styles.register_link_container}>
              <Link to="/register">Dont have an account? Register</Link>
            </div>
          </form>
        </div>
        {/* <div className={styles.parent_cont_right}>
          <div>
            <h1 className={styles.h1}>GigChain</h1>
            <p className={styles.p}>Feel the Freedom & Control</p>
          </div>
        </div> */}
      </div>
    </React.Fragment>
  );
}
