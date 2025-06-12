import { useEffect } from "react";
import axios from "axios";
import styles from "./styles/savedItems.module.scss";
import { useAuth } from "../../../contexts/authContext";
import ServiceCard from "../../../components/service-card/service-card";
import ListingCard from "../../../components/listingCard/listingCard";
import { useQuery } from "@tanstack/react-query";

const SavedItemsPage = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["userData", currentUser?.id],
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

  const { data: savedProfessionals = [], isLoading: isProfessionalsLoading } = useQuery(
    {
      queryKey: ["savedProfessionals", userData?.savedProfiles],
      queryFn: async () => {
        if (!userData?.savedProfiles?.length) return [];

        const professionalData = await Promise.all(
          userData.savedProfiles.map((savedProfileId) =>
            axios.get(
              `${
                import.meta.env.VITE_API_URL
              }/api/user/saved-professionals/${savedProfileId}`
            )
          )
        );

        return professionalData.map((response) => response.data);
      },
      enabled: !!userData?.savedProfiles?.length,
    }
  );

  const { data: savedListings = [], isLoading: isListingsLoading } = useQuery(
    {
      queryKey: ["saved-listings", currentUser?.id],
      queryFn: async () => {
        if (!currentUser?.id) return [];
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/supplier/listing/saved/${currentUser.id}`
        );
        return response.data;
      },
      enabled: !!currentUser?.id,
    }
  );

  const isLoading = isUserLoading || isProfessionalsLoading || isListingsLoading;

  return (
    <div className={styles.savedItemsParentContainer}>
      <div className={styles.section}>
        <h2 className={styles.heading}>
          Saved Professionals ({savedProfessionals.length})
        </h2>
        <div className={styles.savedItemsContainer}>
          {savedProfessionals.length === 0 && (
            <h2 className={styles.noSavedItems}>
              You don&apos;t have any saved professionals...
            </h2>
          )}
          {savedProfessionals.map((savedItem) => (
            <ServiceCard
              key={savedItem?.userId?._id}
              professional={savedItem}
              isSaved={true}
              showCoverImage={false}
            />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>
          Saved Listings ({savedListings.length})
        </h2>
        <div className={styles.savedItemsContainer}>
          {savedListings.length === 0 && (
            <h2 className={styles.noSavedItems}>
              You don&apos;t have any saved listings...
            </h2>
          )}
          {savedListings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              isSaved={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedItemsPage;
