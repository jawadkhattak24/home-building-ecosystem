import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles/register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useAuth } from "../../contexts/authContext";
import shaderGif from "../../assets/shadergradientHD.webm";
import PropTypes from "prop-types";

function RegistrationForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    userType: "",
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const sendVerificationCode = async (email) => {
    try {
      const available = await checkEmailAvailability(email);
      if (!available) {
        setErrors({ email: "Email is already in use" });
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-verification`,
        { email }
      );
      if (response.status === 200) {
        setIsEmailVerificationSent(true);
        setNotification({
          message: "Verification code sent to your email",
          type: "success",
        });
        setErrors({});
        setRemainingTime(60);
        setIsResendDisabled(true);
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setNotification({
        message: "Failed to send verification code",
        type: "error",
      });
    }
  };

  const verifyCode = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/verify-code`,
        {
          email: userData.email,
          verificationCode: verificationCode,
        }
      );
      if (response.status === 200) {
        setEmailVerified(true);
        setNotification({
          message: "Email verified successfully!",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setNotification({
        message: "Invalid verification code",
        type: "error",
      });
    }
  };

  useEffect(() => {
    let timer;
    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [remainingTime]);

  const handleGoogleLogin = () => {
    console.log("Handle google login called");

    console.log("User type in handleGoogleLogin:", userData.userType);
    setIsLoading(true);
    const userType = userData.userType;
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/auth/google?userType=${userType}`;
  };

  const handleFacebookLogin = () => {
    const userType = userData.userType;
    setIsLoading(true);
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/auth/facebook?userType=${userType}`;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmailVerified(false);
      setIsEmailVerificationSent(false);
      setVerificationCode("");
      setNotification({ message: "", type: "" });

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address",
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeEmail = () => {
    setEmailVerified(false);
    setIsEmailVerificationSent(false);
    setVerificationCode("");
    setNotification({ message: "", type: "" });
  };

  const checkEmailAvailability = async (value) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/check-email`,
        { params: { email: value } }
      );
      return res.data.available;
    } catch (error) {
      console.error(`Error checking email availability:`, error);
      return false;
    }
  };
  const newErrors = {};

  const validateBasicInfo = async () => {
    if (!userData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(userData.email)) {
      newErrors.email = "Enter a valid email address";
    } else if (!(await checkEmailAvailability(userData.email))) {
      newErrors.email = "Email is already in use";
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!userData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(userData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include one number, one special character, and one letter";
    }

    if (!userData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!emailVerified) {
      newErrors.email = "Please verify your email first";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    const isValid = await validateBasicInfo();
    if (!isValid) {
      console.log("Basic info validation failed");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
        }
      );
      const { user, token } = res.data;

      if (res.status === 200) {
        login(user, token);
        navigate("/homeNew");
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.register_wrapper}>
      {isLoading && (
        <div className={styles.loadingWrapper}>
          <div className={styles.loader}></div>
          <p className={styles.loadingText}>Registering...</p>
        </div>
      )}
      <div className={styles.parent_cont_left}>
        <video
          src={shaderGif}
          loading="lazy"
          preload="none"
          autoPlay
          loop
          muted
          className={styles.shaderGif}
        />
        <div className={styles.logo_container}>
          <Link to="/" className={styles.logo_link}>
            <h2>Home Building Ecosystem</h2>
          </Link>
          <p className={styles.logo_p}>
            Find everything you need to build your dream home - all in one
            place.
          </p>
        </div>
        <Link to="/login" className={styles.signIn_link}>
          Already have an account? Sign In
        </Link>
      </div>

      <div className={styles.parent_cont_right}>
        <div className={styles.main_content_container}>
          <div className={styles.basicInfo}>
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

            <div className={styles.or_container}>
              <div className={styles.line}></div>
              <div className={styles.or_text}>or</div>
              <div className={styles.line}></div>
            </div>

            <div className={styles.input_container}>
              <div className={styles.input_wrapper}>
                <input
                  type="text"
                  name="name"
                  className={styles.input}
                  placeholder="Name"
                  value={userData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className={styles.error}>{errors.name}</p>}
              </div>

              <div className={styles.emailVerificationContainer}>
                <div className={styles.emailInputWrapper}>
                  <input
                    type="email"
                    name="email"
                    className={`${styles.input} ${
                      emailVerified ? styles.disabled : ""
                    }`}
                    placeholder="Email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={emailVerified || isEmailVerificationSent}
                  />
                  <button
                    type="button"
                    className={styles.verifyButton}
                    onClick={
                      emailVerified
                        ? handleChangeEmail
                        : () => sendVerificationCode(userData.email)
                    }
                    disabled={
                      !userData.email ||
                      errors.email ||
                      (isEmailVerificationSent && isResendDisabled)
                    }
                  >
                    {emailVerified
                      ? "Change Email"
                      : isEmailVerificationSent
                      ? remainingTime > 0
                        ? `Resend Code (${remainingTime}s)`
                        : "Resend Code"
                      : "Verify Email"}
                  </button>
                </div>
                {errors.email && (
                  <p
                    className={styles.verifiedBadge}
                    style={{ color: "#e74c3c" }}
                  >
                    ✗ {errors.email}
                  </p>
                )}

                {isEmailVerificationSent && !emailVerified && (
                  <div className={styles.verificationCodeWrapper}>
                    <input
                      type="text"
                      placeholder="Enter verification code"
                      className={styles.input}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.verifyButton}
                      onClick={verifyCode}
                    >
                      Submit Code
                    </button>
                  </div>
                )}

                {/* {emailVerified && (
                  <p className={styles.verifiedBadge}>✓ Email Verified</p>
                )} */}

                {notification.message && (
                  <p
                    className={styles.verifiedBadge}
                    style={{
                      color:
                        notification.type === "error" ? "#e74c3c" : "#2ecc71",
                    }}
                  >
                    {notification.type === "error" ? "✗" : "✓"}{" "}
                    {notification.message}
                  </p>
                )}
              </div>

              <div className={styles.input_wrapper}>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={styles.input}
                    placeholder="Password"
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
              </div>

              <div className={styles.input_wrapper}>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={styles.input}
                    placeholder="Confirm Password"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className={styles.error}>{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleRegister}
            className={styles.register_button}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;

RegistrationForm.propTypes = {
  userData: PropTypes.object.isRequired,
  setUserType: PropTypes.func.isRequired,
};
