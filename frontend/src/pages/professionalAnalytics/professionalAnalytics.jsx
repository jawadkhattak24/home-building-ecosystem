import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styles from "./styles/professionalAnalytics.module.scss";
import { useAuth } from "../../contexts/authContext";

const ProfessionalAnalytics = () => {
  const { currentUser } = useAuth();

  const { data: analytics, isError, isLoading } = useQuery({
    queryKey: ['professionalAnalytics', currentUser.id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/professional-analytics/${currentUser.id}`
      );
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading analytics</div>;
  }

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
          <p>{analytics?.analytics?.saveCount || 0}</p>
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
