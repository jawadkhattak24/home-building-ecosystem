import { useState } from "react";
import styles from "./styles/setupProfessionalProfile.module.scss";

const SetupProfessionalProfile = () => {
  const [userData, setUserData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const serviceTypes = [
    "Plumber",
    "Electrician",
    "Painter",
    "Architect",
    "Carpenter",
    "Landscaper",
    "Mason",
    "Roofer",
    "HVAC Technician",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userData);
  };

  return (
    <div className={styles.setupProfessionalProfile}>
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
    </div>
  );
};

export default SetupProfessionalProfile;
