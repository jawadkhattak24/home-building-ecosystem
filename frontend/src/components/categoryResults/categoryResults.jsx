import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ServiceCard from "../service-card/service-card";
import styles from "./styles/categoryResults.module.scss";

const CategoryResults = () => {
  const { category } = useParams();
  const [categoryResults, setCategoryResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryResults = async () => {
      const results = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/service/category/${category}`
      );
      setCategoryResults(results.data);
      setLoading(false);
    };
    fetchCategoryResults();
  }, [category]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          <div className={styles.categoryResultsMainContainer}>
            <h2>Search Results for "{category}"</h2>
            <div className={styles.categoryResultsContainer}>
              {categoryResults.map((professional) => (
                <ServiceCard
                  key={professional._id}
                  professional={professional}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryResults;
