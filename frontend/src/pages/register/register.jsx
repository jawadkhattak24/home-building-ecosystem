import React, { useState } from "react";
import axios from "redaxios";
import styles from "./styles/register.module.scss";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    userType: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleUserTypeSelect = (type) => {
    setUserData({ ...userData, userType: type });
    setErrors({ ...errors, userType: "" });
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/register-google`,
        { tokenId: response.credential, userType: userData.userType }
      );
      console.log("Response from Google registration:", res.data);
      alert("Registration with Google successful, redirecting to home page");
      const { token, user } = res.data;
      login({ token, user });
      // localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      console.error("Error registering with Google", error);
      alert("Error registering with Google");
    }
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
    if (!userData.firstName) newErrors.firstName = "First name is required";
    if (!userData.lastName) newErrors.lastName = "Last name is required";
    if (!userData.email) newErrors.email = "Email is required";
    if (!userData.password) newErrors.password = "Password is required";
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

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        userData
      );
      console.log(res.data);

      const codeRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/send-verification`,
        { email: userData.email }
      );
      console.log(codeRes.data);
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
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.userType_container}>
            <p>Register as a:</p>
            <div className={styles.userType_buttons_container}>
              <button
                type="button"
                className={`${styles.userType_button} ${
                  userData.userType === "employer" ? styles.selected : ""
                }`}
                onClick={() => handleUserTypeSelect("employer")}
              >
                Employer
              </button>
              <button
                type="button"
                className={`${styles.userType_button} ${
                  userData.userType === "freelancer" ? styles.selected : ""
                }`}
                onClick={() => handleUserTypeSelect("freelancer")}
              >
                Freelancer
              </button>
            </div>
            {errors.userType && (
              <p className={styles.error}>{errors.userType}</p>
            )}
          </div>
        );

      case 2:
        return (
          <>
            {/* <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin
                buttonText="Register with Google"
                onSuccess={handleGoogleSuccess}
                onFailure={(error) =>
                  console.error("Google Sign-In Error", error)
                }
                cookiePolicy={"single_host_origin"}
              />
            </GoogleOAuthProvider> */}

            <div className={styles.or_container}>
              <div className={styles.line}></div>
              <div className={styles.or_text}>or</div>
              <div className={styles.line}></div>
            </div>

            <input
              className={styles.input}
              type="text"
              placeholder="First Name"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <p className={styles.error}>{errors.firstName}</p>
            )}
            <input
              className={styles.input}
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className={styles.error}>{errors.lastName}</p>
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
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              name="password"
              value={userData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}
            <input
              className={styles.input}
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword}</p>
            )}
          </>
        );

      case 3:
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
          <div>
            <h1 className={styles.h1}>GigChain</h1>
            <p className={styles.p}>Feel the Freedom & Control</p>
            <div className={styles.signIn_link_container}>
              <Link to="/login" className={styles.signIn_link}>
                Already a GigChain user? Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.parent_cont_left}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 3) {
                handleVerifyCode(e);
              } else if (step === 2) {
                handleSubmit();
              } else {
                handleNextStep();
              }
            }}
            className={styles.main_content_container}
          >
            <div className={styles.stepContainer}>
              <h2 className={styles.h4}>Register - Step {step} of 3</h2>
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
                  Next <ArrowRight size={20} />
                </button>
              )}
              {step === 2 && (
                <button type="submit" className={styles.nav_button}>
                  Verify Email <ArrowRight size={20} />
                </button>
              )}
              {step === 3 && (
                <button type="submit" className={styles.button_primary}>
                  Complete Registration
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}
