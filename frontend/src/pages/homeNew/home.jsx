import React, { useState, useEffect } from "react";
import axios from "redaxios";
import styles from "./styles/home.module.scss";
import FeaturedServicesSection from "../../components/featured-services-section/featured-services-section";
import ServiceCard from "../../components/service-card/service-card";
import { useAuth } from "../../contexts/authContext";
import { FaSearch, FaHome } from "react-icons/fa";
import { motion } from "framer-motion";
import shaderGif from "../../assets/shadergradientHD.webm";

function HomePage() {
  const { currentUser } = useAuth();
  console.log("Current User in HomeNew:", currentUser);

  // useEffect(()=>{
  //   const fetchUser=async ()=>{
  //   const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/me`)
  //   }

  // })

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
          <video
            src={shaderGif}
            loading="lazy"
            preload="none"
            autoPlay
            speed={0.5}
            loop
            muted
            className={styles.shaderGif}
          />
          <div className={styles.headings_container}>
            {/* <FaHome className={styles.homeIcon} /> */}
            <h1 className={styles.hero_heading}>
              Transform Your Dream <br /> Home Into Reality
            </h1>
            <p className={styles.hero_subheading}>
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
        </motion.div>

        {searchResults.length > 0 ? (
          <div className={styles.searchResultsParentContainer}>
            <h2>Search Results for "{oldSearchQuery || searchQuery}"</h2>
            <div className={styles.searchResultsMainContainer}>
              {searchResults.map((professional) => (
                <ServiceCard
                  key={professional._id}
                  professional={professional}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.featuredServicesContainer}>
            <FeaturedServicesSection
              featuredSectionType={"service"}
              serviceType={"Architect"}
            />
            <FeaturedServicesSection
              featuredSectionType={"service"}
              serviceType={"Interior Designer"}
            />
            <FeaturedServicesSection
              featuredSectionType={"service"}
              serviceType={"Electrician"}
            />
            <FeaturedServicesSection
              featuredSectionType={"listing"}
              listingType={"cement"}
            />
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default HomePage;
