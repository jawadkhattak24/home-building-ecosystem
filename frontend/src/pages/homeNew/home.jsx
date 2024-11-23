import React, { useState } from "react";
import axios from "redaxios";
import styles from "./styles/home.module.scss";
import FeaturedServicesSection from "../../components/featured-services-section/featured-services-section";
import ServiceCard from "../../components/search-result-card/search-result-card";
import { useAuth } from "../../contexts/authContext";
import Navigation from "../../components/navigation/navigation";
import Footer from "../../components/footer/footer";

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
      // console.log(response.data[0]);
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
      <Navigation />
      <div className={styles.home_wrapper}>
        <div className={styles.hero_container}>
          <div className={styles.headings_container}>
            <h5>Welcome, Khan</h5>
            <h1>
              Find the best suppliers and contractors to build your dream home
            </h1>
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
            <FeaturedServicesSection serviceType={"Development"} />
            <FeaturedServicesSection serviceType={"Web Development"} />
            <FeaturedServicesSection serviceType={"Graphic Design"} />
          </div>
        )}
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default HomePage;
