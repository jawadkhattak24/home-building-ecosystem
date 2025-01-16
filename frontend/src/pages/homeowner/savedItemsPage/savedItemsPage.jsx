import { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "./styles/savedItems.module.scss";
import { useAuth } from "../../../contexts/authContext";
import ServiceCard from "../../../components/service-card/service-card";
import { useLoading } from "../../../contexts/loadingContext";

const SavedItemsPage = () => {
  const { currentUser } = useAuth();

  const { isLoading, setIsLoading, LoadingUI } = useLoading();
  const [savedItems, setSavedItems] = useState([]);

  const fetchSavedItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const savedProfiles = response.data.user.savedProfiles;

      try {
        const professionalData = await Promise.all(
          savedProfiles.map((savedProfile) =>
            axios.get(
              `${
                import.meta.env.VITE_API_URL
              }/api/user/saved-professionals/${savedProfile}`
            )
          )
        );

        setSavedItems(professionalData.map((response) => response.data));
      } catch (error) {
        console.error("Error fetching saved items:", error);
      }
    } catch (error) {
      console.error("Error fetching saved items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedItems();
  }, [currentUser]);

  console.log("Saved items: ", savedItems);

  if (isLoading) {
    return <LoadingUI />;
  }

  return (
    <>
      <div className={styles.savedItemsParentContainer}>
        <h2 className={styles.heading}>
          Saved Professionals ({savedItems.length})
        </h2>
        <div className={styles.savedItemsContainer}>
          {savedItems.length === 0 && (
            <h2 className={styles.noSavedItems}>
              You don&apos;t have any saved items...
            </h2>
          )}
          {savedItems.map((savedItem) => (
            <ServiceCard
              key={savedItem?.userId?._id}  
              professional={savedItem}
              isSaved={true}
              showCoverImage={false}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SavedItemsPage;
