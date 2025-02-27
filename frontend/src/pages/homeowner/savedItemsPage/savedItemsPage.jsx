import { useContext } from "react";
import axios from "axios";
import styles from "./styles/savedItems.module.scss";
import { useAuth } from "../../../contexts/authContext";
import ServiceCard from "../../../components/service-card/service-card";
// import { LoadingContext } from "../../../contexts/loadingContext";
import { useQuery } from "@tanstack/react-query";

const SavedItemsPage = () => {
  const { currentUser } = useAuth();
  // const { LoadingUI } = useContext(LoadingContext);

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['userData', currentUser?.id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.user;
    },
    enabled: !!currentUser?.id,
  });

  const { data: savedItems = [], isLoading: isProfessionalsLoading } = useQuery({
    queryKey: ['savedProfessionals', userData?.savedProfiles],
    queryFn: async () => {
      if (!userData?.savedProfiles?.length) return [];
      
      const professionalData = await Promise.all(
        userData.savedProfiles.map((savedProfileId) =>
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/user/saved-professionals/${savedProfileId}`
          )
        )
      );
      
      return professionalData.map((response) => response.data);
    },
    enabled: !!userData?.savedProfiles?.length,
  });

  const isLoading = isUserLoading || isProfessionalsLoading;

  // if (isLoading) {
  //   return <LoadingUI />;
  // }

  console.log(savedItems);

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