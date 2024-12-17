/* eslint-disable react/prop-types */
import { useEffect } from "react";
import styles from "./styles/search-result-card.module.scss";
import { Link } from "react-router-dom";
import axios from "axios";

function SearchResultCard({ service }) {
  // console.log("description: ", props.service.description);

  // useEffect(() => {
  //   const recordImpression = async () => {
  //     try {
  //       await axios.post(
  //         `${import.meta.env.VITE_API_URL}/api/service/${
  //           service._id
  //         }/impression`
  //       );
  //     } catch (error) {
  //       console.error("Error recording impression:", error);
  //     }
  //   };

  //   recordImpression();
  // }, [service._id]);

  const Id = service._id;
  return (
    <Link to={`/service/${Id}`}>
      <div className={styles.service_card}>
        <img
          className={styles.thumbnailImage}
          width={400}
          height={200}
          src={service.thumbnailUrl || service.images[0]}
          alt={service.category}
        />
        <div className={styles.cardDetails}>
          <h3>{service.title}</h3>
          <p>
            ⭐ {service.rating} ({service.numReviews})
          </p>
          <p className={styles.serviceDescription}>{service.description}</p>
        </div>
      </div>
    </Link>
  );
}

export default SearchResultCard;
