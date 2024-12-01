import { useState } from "react";
import styles from "./styles/supplierProfileSetup.module.scss";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "redaxios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { useLoading } from "../../../contexts/loadingContext";

const SupplierProfileSetup = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { isLoading, setIsLoading, LoadingUI } = useLoading();
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const userDataToSend = {
    email: currentUser.email,
    businessName: userData.businessName,
    contactInfo: userData.contactInfo,
    additionalDetails: userData.additionalDetails,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/supplier/profile`,
        userDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      {isLoading && LoadingUI()}
      <div className={styles.supplierInfo}>
        <Link to="/" className={styles.home_link}>
          Home Building Ecosystem
        </Link>
        <div className={styles.input_container}>
          <h3>Setup Your Supplier Profile</h3>
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

          <button className={styles.button_primary} onClick={handleSubmit}>
            Go to Dashboard <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default SupplierProfileSetup;
