import { useState } from "react";
import styles from "./styles/professionalProfileSetup.module.scss";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import axios from "redaxios";
import { useLoading } from "../../../contexts/loadingContext";
1;

const ProfessionalProfileSetup = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({});
  const [errors, setErrors] = useState({});
  const { isLoading, setIsLoading, loadingUI } = useLoading();
  const navigate = useNavigate();

  const serviceTypes = [
    "Architect",
    "Plumber",
    "Electrician",
    "Interior Designer",
    "General Contractor",
    "Carpenter",
  ];

  const userEmail = currentUser.email;

  const userDataToSend = {
    email: userEmail,
    ...userData,
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/professional/profile`,
        userDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      setTimeout(() => {
        if (response.status === 200) {
          navigate("/homeNew");
          setIsLoading(false);
        }
      }, 2000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && loadingUI()}
      <div className={styles.professionalInfo}>
        <Link to="/" className={styles.home_link}>
          Home Building Ecosystem
        </Link>
        <div className={styles.input_container}>
          <h3>Setup Your Professional Profile</h3>
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

          <button className={styles.button_primary} onClick={handleSubmit}>
            Go to Dashboard <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfessionalProfileSetup;
