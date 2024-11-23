import React, { useState } from "react";
import axios from "redaxios";
import styles from "./styles/register.module.scss";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/user/facebook`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [e.target.name]: e.target.value });

    if (name == "username" && !/^[a-zA-Z0-9_-]+$/.test(value)) {
      setErrors({
        ...errors,
        username:
          "Username can only contain letters, numbers, underscores, and hyphens",
      });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleUserTypeSelect = (type) => {
    setUserData({ ...userData, userType: type });
    setErrors({ ...errors, userType: "" });
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!userData.email) {
      alert("Email is required to verify the code.");
      return;
    }
    if (!userData.verificationCode) {
      alert("Verification code is required.");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/verify-code`,
        {
          params: {
            email: userData.email,
            verificationCode: userData.verificationCode,
          },
        }
      );

      if (res.data && res.data.success) {
        handleSignIn();
      } else {
        alert(res.data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error verifying code:", error.response.data);
        alert(error.response.data.message || "Verification failed.");
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert(
          "No response from server. Please check your network and try again."
        );
      } else {
        console.error("Error setting up request:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleSignIn = async () => {
    // Validate input fields
    if (!userData.email) {
      alert("Email is required to sign in.");
      return;
    }
    if (!userData.password) {
      alert("Password is required to sign in.");
      return;
    }

    try {
      const signInData = {
        email: userData.email,
        password: userData.password,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/signin`,
        signInData
      );

      if (res.data && res.data.token && res.data.user) {
        const { token, user } = res.data;
        login({ token, user });
        // localStorage.setItem("token", token);
        // localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        alert(res.data.message || "Sign in failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error signing in:", error.response.data);
        alert(error.response.data.message || "Sign in failed.");
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert(
          "No response from server. Please check your network and try again."
        );
      } else {
        console.error("Error setting up request:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!userData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!usernameRegex.test(userData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, underscores, and hyphens";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(userData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!userData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(userData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include one number, one special character, and one letter";
    }

    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    console.log("Sending data to server:", userData);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        userData
      );
      console.log("Registration response:", res.data);

      const codeRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-verification`,
        { email: userData.email }
      );
      console.log("Verification code response:", codeRes.data);
      alert("Verification code sent to your email");
      handleNextStep();
    } catch (error) {
      console.error("Registration error:", error.response.data);
      alert(error.response.data.message);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleNextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <input
              className={styles.input}
              type="text"
              placeholder="Name"
              name="name"
              value={userData.name}
              onChange={handleChange}
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
            <input
              className={styles.input}
              type="text"
              placeholder="Username"
              name="username"
              value={userData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <p className={styles.error}>{errors.username}</p>
            )}
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
            <div className={styles.passwordWrapper}>
              <input
                className={styles.input}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={userData.password}
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
            {errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}

            <div className={styles.passwordWrapper}>
              <input
                className={styles.input}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword}</p>
            )}
          </>
        );

      case 2:
        return (
          <>
            <p>Please enter the verification code sent to your email:</p>
            <input
              className={styles.input}
              type="text"
              placeholder="Verification Code"
              name="verificationCode"
              value={userData.verificationCode}
              onChange={handleChange}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <div className={styles.signUp_wrapper}>
        <div className={styles.parent_cont_right}>
          <Link to="/" className={styles.logo_link}>
            <h2 className={styles.h2}>Home Building Ecosystem</h2>
          </Link>
          <div className={styles.social_login_container}>
            <button className={styles.socialButton} onClick={handleGoogleLogin}>
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

          <Link to="/login" className={styles.signIn_link}>
            Already have an account? Sign In
          </Link>
        </div>

        <div className={styles.parent_cont_left}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 2) {
                handleVerifyCode(e);
              } else if (step === 1) {
                handleSubmit();
              } else {
                handleNextStep();
              }
            }}
            className={styles.main_content_container}
          >
            <div className={styles.stepContainer}>
              <h2>Register</h2>
            </div>
            <div className={styles.input_container}>{renderStep()}</div>
            <div className={styles.navigation_container}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className={styles.nav_button}
                >
                  <ArrowLeft size={20} /> Back
                </button>
              )}
              {step === 1 && (
                <button type="submit" className={styles.nav_button}>
                  Verify Email <ArrowRight size={20} />
                </button>
              )}
              {step === 2 && (
                <button type="submit" className={styles.nav_button}>
                  Complete Sign Up <ArrowRight size={20} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}
