import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles/professionalAnalytics.module.scss";
import { useAuth } from "../../contexts/authContext";

const ProfessionalAnalytics = () => {
  const { currentUser } = useAuth();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/professional-analytics/${
          currentUser.id
        }`
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error("An error occured fetching professional analytics:", error);
    }
  };

  return (
    <div className={styles.analyticsParentContainer}>
      <h1>Professional Analytics</h1>
      <div className={styles.analyticsContainer}>
        <div className={styles.analyticsItem}>
          <h2>Impressions</h2>
          <p>{analytics?.impressions || 0}</p>
        </div>
        <div className={styles.analyticsItem}>
          <h2>Profile Clicks</h2>
          <p>{analytics?.clicks || 0}</p>
        </div>
        <div className={styles.analyticsItem}>
          <h2>Saved</h2>
          <p>{analytics?.saved || 0}</p>
        </div>
        <div className={styles.analyticsItem}>
          <h2>Contacted</h2>
          <p>{analytics?.contacted || 0}</p>
        </div>
        <div className={styles.analyticsItem}>
          <h2>Reviews</h2>
          <p>{analytics?.reviews || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalAnalytics;
