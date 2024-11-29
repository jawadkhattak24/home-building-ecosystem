import { useCallback, useState, useEffect } from "react";
import axios from "redaxios";
import styles from "./styles/register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useAuth } from "../../contexts/authContext";
import PropTypes from "prop-types";

function RegistrationForm() {
  const [step, setStep] = useState(1);
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
    userType: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    serviceType: "",
    yearsExperience: "",
    bio: "",
    certifications: "",
    portfolioLink: "",
    businessName: "",
    contactInfo: "",
    additionalDetails: "",
  });

  const [errors, setErrors] = useState({
    userType: "",
  });

  const serviceTypes = [
    "Architect",
    "Plumber",
    "Electrician",
    "Interior Designer",
    "General Contractor",
    "Carpenter",
  ];
  console.log("Step in RegistrationForm:", step);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const [codeCount, setCodeCount] = useState(0);

  const sendVerificationCode = async (email) => {
    try {
      const available = await checkAvailability("email", email);
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

  const handleUserTypeSelect = (type) => {
    console.log("User type in handleUserTypeSelect:", type);
    setUserData({ ...userData, userType: type });
    setErrors((prev) => ({ ...prev, userType: "" }));
  };

  const handleChangeEmail = () => {
    setEmailVerified(false);
    setIsEmailVerificationSent(false);
    setVerificationCode("");
    setNotification({ message: "", type: "" });
  };

  const checkAvailability = async (field, value) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/check-${field}`,
        { params: { [field]: value } }
      );
      return res.data.available;
    } catch (error) {
      console.error(`Error checking ${field} availability:`, error);
      return false;
    }
  };
  const newErrors = {};

  const validateUserType = () => {
    if (!userData.userType) {
      setErrors((prev) => ({ ...prev, userType: "Please select a user type" }));
      return;
    } else {
      setStep(step + 1);
    }
  };

  const validateBasicInfo = async () => {
    if (!userData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(userData.email)) {
      newErrors.email = "Enter a valid email address";
    } else if (!(await checkAvailability("email", userData.email))) {
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

  const validateProfessionalInfo = () => {
    const newErrors = {};

    if (!userData.serviceType) {
      newErrors.serviceType = "Service type is required";
    }
    if (!userData.yearsExperience) {
      newErrors.yearsExperience = "Years of experience is required";
    }
    if (!userData.bio) {
      newErrors.bio = "Bio is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAdvertiserInfo = () => {
    const newErrors = {};

    if (!userData.businessName) {
      newErrors.businessName = "Business name is required";
    }
    if (!userData.contactInfo) {
      newErrors.contactInfo = "Contact information is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registrationFunction = useCallback(async () => {
    console.log("Registration function called");
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/user/register`,
      {
        userType: userData.userType,
        name: userData.name,
        email: userData.email,
        password: userData.password,
      }
    );
    const { user, token } = res.data;
    return { user, token, res };
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Handle submit called");

    if (step === 2) {
      const isValid = await validateBasicInfo();
      if (!isValid) {
        console.log("Basic info validation failed");
        return;
      }
    }

    if (userData.userType === "homeowner") {
      try {
        console.log("Step 2");
        setIsLoading(true);
        const { user, token, res } = await registrationFunction();

        if (res.status === 200) {
          login(user, token);
          setTimeout(() => {
            navigate("/homeNew");
          }, 2000);
        } else {
          console.error(
            "Registration error occured in step 2:",
            res.data.message
          );
        }
      } catch (error) {
        console.error("Registration error:", error.response?.data);
        alert(error.response?.data.message || "Registration failed");
      } finally {
        setIsLoading(false);
      }
    } else {
      setStep(3);
    }

    if (step === 3) {
      let isValid = false;
      if (userData.userType === "professional") {
        isValid = validateProfessionalInfo();
      } else {
        isValid = validateAdvertiserInfo();
      }
      if (!isValid) {
        console.log("Professional or advertiser info validation failed");
        return;
      }

      try {
        console.log("Step 3");
        setIsLoading(true);

        const { res } = await registrationFunction();

        if (res.status === 200) {
          const endpoint =
            userData.userType === "professional"
              ? "/api/user/professional/profile"
              : "/api/user/supplier/profile";

          const dataToSend =
            userData.userType === "professional"
              ? {
                  email: userData.email,
                  serviceType: userData.serviceType,
                  yearsExperience: userData.yearsExperience,
                  bio: userData.bio,
                  certifications: userData.certifications,
                  portfolioLink: userData.portfolioLink,
                }
              : {
                  email: userData.email,
                  businessName: userData.businessName,
                  contactInfo: userData.contactInfo,
                  additionalDetails: userData.additionalDetails,
                };

          const profileRes = await axios.post(
            `${import.meta.env.VITE_API_URL}${endpoint}`,
            dataToSend
          );

          const { user, token } = profileRes.data;

          console.log("Profile creation response:", profileRes.data);

          if (profileRes.status === 200) {
            login(user, token);
            setTimeout(() => {
              navigate(
                userData.userType === "professional"
                  ? "/professional-homepage"
                  : "/supplier-homepage"
              );
            }, 2000);
          } else {
            console.error("Profile creation error:", profileRes.data.message);
          }
        }
      } catch (error) {
        console.error("Registration error:", error.response?.data);
        alert(error.response?.data.message || "Registration failed");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.userTypeSelection}>
            <h2>What do you want to do?</h2>

            <div className={styles.userTypeButtons_container}>
              <button
                className={`${styles.userTypeButton} ${
                  userData.userType === "homeowner" ? styles.selected : ""
                }`}
                onClick={() => handleUserTypeSelect("homeowner")}
              >
                Build Your Dream Home
              </button>
              <button
                className={`${styles.userTypeButton} ${
                  userData.userType === "professional" ? styles.selected : ""
                }`}
                onClick={() => handleUserTypeSelect("professional")}
              >
                Offer Your Professional Services
              </button>
              <button
                className={`${styles.userTypeButton} ${
                  userData.userType === "supplier" ? styles.selected : ""
                }`}
                onClick={() => handleUserTypeSelect("supplier")}
              >
                Advertise Your Building Materials
              </button>

              {errors.userType && (
                <p
                  className={styles.verifiedBadge}
                  style={{ color: "#e74c3c" }}
                >
                  ✗ {errors.userType}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
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
        );

      case 3:
        return userData.userType === "professional" ? (
          <div className={styles.professionalInfo}>
            <h3 className={styles.professionalInfo_h3}>
              Setup Your Professional Profile
            </h3>
            <div className={styles.input_container}>
              <div className={styles.input_wrapper}>
                <select
                  name="serviceType"
                  value={userData.serviceType}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">Select Service Type</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.serviceType && (
                  <p className={styles.error}>{errors.serviceType}</p>
                )}
              </div>

              <div className={styles.input_wrapper}>
                <input
                  type="number"
                  name="yearsExperience"
                  placeholder="Years of Experience"
                  value={userData.yearsExperience}
                  onChange={handleChange}
                  className={styles.input}
                />
                {errors.yearsExperience && (
                  <p className={styles.error}>{errors.yearsExperience}</p>
                )}
              </div>

              <div className={styles.input_wrapper}>
                <textarea
                  name="bio"
                  placeholder="Short Bio"
                  value={userData.bio}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.textarea}`}
                />
                {errors.bio && <p className={styles.error}>{errors.bio}</p>}
              </div>

              <div className={styles.input_wrapper}>
                <input
                  type="text"
                  name="certifications"
                  className={styles.input}
                  placeholder="Certifications (optional)"
                  value={userData.certifications}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.input_wrapper}>
                <input
                  type="url"
                  name="portfolioLink"
                  className={styles.input}
                  placeholder="Portfolio Link (optional)"
                  value={userData.portfolioLink}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.advertiserInfo}>
            <h3 className={styles.supplierInfo_h3}>
              Setup Your Supplier Profile
            </h3>
            <div className={styles.input_container}>
              <div className={styles.input_wrapper}>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Business Name"
                  value={userData.businessName}
                  onChange={handleChange}
                  className={styles.input}
                />
                {errors.businessName && (
                  <p className={styles.error}>{errors.businessName}</p>
                )}
              </div>

              <div className={styles.input_wrapper}>
                <textarea
                  name="contactInfo"
                  placeholder="Contact Information"
                  value={userData.contactInfo}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.textarea}`}
                />
                {errors.contactInfo && (
                  <p className={styles.error}>{errors.contactInfo}</p>
                )}
              </div>

              <div className={styles.input_wrapper}>
                <textarea
                  name="additionalDetails"
                  placeholder="Additional Details (optional)"
                  value={userData.additionalDetails}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.textarea}`}
                />
                {errors.additionalDetails && (
                  <p className={styles.error}>{errors.additionalDetails}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.register_wrapper}>
      {isLoading && (
        <div className={styles.loadingWrapper}>
          <div className={styles.loader}></div>
          <p className={styles.loadingText}>Logging in...</p>
        </div>
      )}
      <div className={styles.parent_cont_right}>
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

      <div className={styles.parent_cont_left}>
        <div className={styles.main_content_container}>
          {renderStep()}

          <div className={styles.navigation_container}>
            {step === 1 && (
              <button
                type="button"
                onClick={validateUserType}
                className={styles.nav_button}
              >
                Next <ArrowRight size={20} />
              </button>
            )}

            {(step === 3 || step === 2) && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className={`${styles.nav_button} ${styles.back_button}`}
              >
                <ArrowLeft size={20} /> Back
              </button>
            )}

            {step === 2 && (
              <button
                type="submit"
                onClick={handleSubmit}
                className={`${styles.nav_button} ${styles.next_button}`}
              >
                Next <ArrowRight size={20} />
              </button>
            )}

            {step === 3 && (
              <button
                type="submit"
                onClick={handleSubmit}
                className={styles.nav_button}
              >
                Complete Registration <ArrowRight size={20} />
              </button>
            )}
          </div>
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