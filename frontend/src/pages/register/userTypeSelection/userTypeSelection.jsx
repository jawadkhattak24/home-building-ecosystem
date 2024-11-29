import { useState } from "react";
import styles from "./styles/userTypeSelection.module.scss";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../../contexts/loadingContext";
import axios from "redaxios";

const UserTypeSelection = () => {
  const [errors, setErrors] = useState({ userType: "" });

  const handleUserTypeSelect = (userType) => {
    setUserType(userType);
    setErrors((prev) => ({ ...prev, userType: "" }));
  };
  const { userType, setUserType } = useAuth();
  const navigate = useNavigate();
  const { isLoading, setIsLoading, loadingUI } = useLoading();
  const handleContinue = async () => {
    try {
      setIsLoading(true);
      if (!userType) {
        setErrors({ userType: "Please select a user type" });
      }
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/update-user-type`,
        { userType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        if (res.data.userType === "homeowner") {
          navigate("/homenew");
        } else if (res.data.userType === "professional") {
          navigate("/professional-profile-setup");
        } else if (res.data.userType === "supplier") {
          navigate("/supplier-profile-setup");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && loadingUI}
      <div className={styles.input_container}>
        <div className={styles.userTypeSelection}>
          <h2>What do you want to do?</h2>
          <div className={styles.userTypeButtons_container}>
            <button
              className={`${styles.userTypeButton} ${
                userType === "homeowner" ? styles.selected : ""
              }`}
              onClick={() => handleUserTypeSelect("homeowner")}
            >
              Build Your Dream Home
            </button>
            <button
              className={`${styles.userTypeButton} ${
                userType === "professional" ? styles.selected : ""
              }`}
              onClick={() => handleUserTypeSelect("professional")}
            >
              Offer Your Professional Services
            </button>
            <button
              className={`${styles.userTypeButton} ${
                userType === "supplier" ? styles.selected : ""
              }`}
              onClick={() => handleUserTypeSelect("supplier")}
            >
              Advertise Your Building Materials
            </button>

            {errors.userType && (
              <p className={styles.verifiedBadge} style={{ color: "#e74c3c" }}>
                ✗ {errors.userType}
              </p>
            )}

            <button className={styles.button_primary} onClick={handleContinue}>
              Continue <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserTypeSelection;
