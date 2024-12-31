import React, { useState } from "react";
import axios from "redaxios";
import styles from "./styles/home.module.scss";
import FeaturedServicesSection from "../../components/featured-services-section/featured-services-section";
import ServiceCard from "../../components/service-card/service-card";
import { useAuth } from "../../contexts/authContext";
import { FaSearch, FaHome } from "react-icons/fa";
import { motion } from "framer-motion";

function HomePage() {
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [oldSearchQuery, setOldSearchQuery] = useState("");

  




  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/service/search?query=${searchQuery}`
      );
      setSearchResults(response.data);
      setOldSearchQuery(searchQuery);
    } catch (error) {
      console.error("Error searching professionals:", error);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  return (
    <React.Fragment>
      <div className={styles.home_wrapper}>
        <motion.div
          className={styles.hero_container}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.headings_container}>
            {/* <FaHome className={styles.homeIcon} /> */}
            <h1>Transform Your Dream <br/> Home Into Reality</h1>
            <p>
              Find Pakistan's top professionals and building material suppliers
              - all on a single platform.
            </p>
          </div>

          <div className={styles.searchBar_container}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.searchInputContainer}>
                <FaSearch className={styles.searchIcon} />
                <input
                  placeholder="Find the best professionals for your project..."
                  className={styles.hero_searchBar}
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
              </div>
              <button className={styles.hero_searchButton} type="submit">
                Search
              </button>
            </form>
          </div>

          <motion.div
            className={styles.decorativeShapes}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <div className={styles.circle}></div>
            <div className={styles.triangle}></div>
            <div className={styles.square}></div>
          </motion.div>
        </motion.div>

        {searchResults.length > 0 ? (
          <div className={styles.searchResultsParentContainer}>
            <h2>Search Results for "{oldSearchQuery || searchQuery}"</h2>
            <div className={styles.searchResultsMainContainer}>
              {searchResults.map((professional) => (
                <ServiceCard key={professional._id} professional={professional} />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.featuredServicesContainer}>
            <FeaturedServicesSection serviceType={"Architect"} />
            <FeaturedServicesSection serviceType={"Interior Designer"} />
            <FeaturedServicesSection serviceType={"Electrician"} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default HomePage;
