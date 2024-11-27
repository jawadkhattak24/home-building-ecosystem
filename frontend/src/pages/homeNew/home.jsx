import React, { useState } from "react";
import axios from "redaxios";
import styles from "./styles/home.module.scss";
import FeaturedServicesSection from "../../components/featured-services-section/featured-services-section";
import ServiceCard from "../../components/search-result-card/search-result-card";
import { useAuth } from "../../contexts/authContext";

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
      console.error("Error searching gigs:", error);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // handleSearch(query);
  };

  return (
    <React.Fragment>
      <div className={styles.home_wrapper}>
        <div className={styles.hero_container}>
          <div className={styles.headings_container}>
            <h5>Welcome, {currentUser.name}</h5>
            <h1>Your one stop solution for building your dream home.</h1>
          </div>

          <div className={styles.searchBar_container}>
            <form onSubmit={handleSearch}>
              <input
                placeholder={"Start typing to search services..."}
                className={styles.hero_searchBar}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
              />
              <button
                className={styles.hero_searchButton}
                // onClick={handleSearch}
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {searchResults.length > 0 ? (
          <div className={styles.searchResultsParentContainer}>
            <h2>
              Search Results for &quot;{oldSearchQuery || searchQuery}&quot;
            </h2>
            <div className={styles.searchResultsMainContainer}>
              {searchResults.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.featuredServicesContainer}>
            <FeaturedServicesSection serviceType={"Architecture"} />
            <FeaturedServicesSection serviceType={"Interior Design"} />
            <FeaturedServicesSection serviceType={"Landscape Design"} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default HomePage;
