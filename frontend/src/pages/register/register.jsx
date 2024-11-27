import { useState } from "react";
import axios from "redaxios";
import styles from "./styles/register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useAuth } from "../../contexts/authContext";

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const [errors, setErrors] = useState({});

  const serviceTypes = [
    "Architect",
    "Plumber",
    "Electrician",
    "Interior Designer",
    "General Contractor",
    "Carpenter",
  ];

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const sendVerificationCode = async (email) => {
    const available = await checkAvailability("email", email);
    if (!available) {
      setErrors({ email: "Email is already in use" });
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-verification`,
        { email }
      );
      if (response.status === 200) {
        setIsEmailVerificationSent(true);
        alert("Verification code sent to your email");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      alert("Failed to send verification code");
    }
  };

  const verifyCode = async () => {
    console.log("Email in verifyCode:", userData.email);
    console.log("Verification code in verifyCode:", verificationCode);
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
        alert("Email verified successfully!");
      } else if (response.status === 400) {
        alert("Invalid verification code");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      alert("Invalid verification code");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/auth/google/callback`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/auth/facebook/callback`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleUserTypeSelect = (type) => {
    setUserData({ ...userData, userType: type });
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

  const validateBasicInfo = async () => {
    const newErrors = {};

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 2 && !validateBasicInfo()) {
      return;
    }

    if (step === 3) {
      if (userData.userType === "professional" && !validateProfessionalInfo()) {
        return;
      }
      if (userData.userType === "supplier" && !validateAdvertiserInfo()) {
        return;
      }
    }

    try {
      if (step === 2) {
        setIsLoading(true);
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

        if (res.status === 200) {
          if (userData.userType === "homeowner") {
            login(user, token);
            setTimeout(() => {
              navigate("/homeNew");
            }, 2000);
          } else {
            setStep(3);
          }
        } else {
          console.error("Registration error:", res.data.message);
        }
        setIsLoading(false);
      }

      if (step === 3) {
        setIsLoading(true);
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

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}${endpoint}`,
          dataToSend
        );

        const { user, token } = res.data;

        console.log("Profile creation response:", res.data);

        if (res.status === 200) {
          login(user, token);
          setTimeout(() => {
            navigate(
              userData.userType === "professional"
                ? "/professional-homepage"
                : "/supplier-homepage"
            );
          }, 2000);
        } else {
          console.error("Profile creation error:", res.data.message);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      alert(error.response?.data.message || "Registration failed");
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
                      isEmailVerificationSent ? styles.disabled : ""
                    }`}
                    placeholder="Email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={isEmailVerificationSent}
                  />
                  {!isEmailVerificationSent && (
                    <button
                      type="button"
                      className={styles.verifyButton}
                      onClick={() => sendVerificationCode(userData.email)}
                      disabled={!userData.email || errors.email}
                    >
                      Verify Email
                    </button>
                  )}
                </div>
                {errors.email && <p className={styles.error}>{errors.email}</p>}

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

                {emailVerified && (
                  <p className={styles.verifiedBadge}>✓ Email Verified</p>
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
        <form onSubmit={handleSubmit} className={styles.main_content_container}>
          {renderStep()}

          <div className={styles.navigation_container}>
            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className={styles.nav_button}
              >
                Next <ArrowRight size={20} />
              </button>
            )}

            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className={`${styles.nav_button} ${styles.back_button}`}
              >
                <ArrowLeft size={20} /> Back
              </button>
            )}

            {step < 3 && step > 1 && (
              <button
                type="submit"
                className={`${styles.nav_button} ${styles.next_button}`}
              >
                Next <ArrowRight size={20} />
              </button>
            )}

            {step === 3 && (
              <button type="submit" className={styles.nav_button}>
                Complete Registration <ArrowRight size={20} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
