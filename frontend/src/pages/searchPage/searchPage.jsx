import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash/debounce";
import styles from "./styles/searchPage.module.scss";
import { BiSort } from "react-icons/bi";

import FiltersSidebar from "./filtersSidebar/filtersSidebar";
import ProfessionalCard from "../../components/service-card/service-card";
import ListingCard from "../../components/listingCard/listingCard";
import LoadingSpinner from "./loadingSpinner/loadingSpinner";

const createDebouncedSearch = (searchParams, setSearchParams) =>
  debounce((value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    setSearchParams(params);
  }, 500);

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get("query") || ""
  );

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("recommended");

  const searchQuery = searchParams.get("query") || "";
  const searchType = searchParams.get("type");
  const category = searchParams.get("category");
  const location = searchParams.get("location");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const rating = searchParams.get("rating");

  console.log("Search Type: ", searchParams.get("type"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [filterType, setFilterType] = useState("professionals");

  const {
    data: professionals = [],
    isLoading: isProfessionalsLoading,
    error: professionalsError,
  } = useQuery({
    queryKey: [
      "professionals",
      searchQuery,
      category,
      location,
      minPrice,
      maxPrice,
      rating,
      sortOrder,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        query: searchQuery,
        ...(category && category !== "All Categories" && { category }),
        ...(location && { location }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(rating && { rating }),
        ...(sortOrder && { sort: sortOrder }),
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/service/search?${params}`
      );
      return response.data;
    },
    enabled: searchType === "professionals",
  });

  const {
    data: listings = [],
    isLoading: isListingsLoading,
    error: listingsError,
  } = useQuery({
    queryKey: [
      "listings",
      searchQuery,
      category,
      location,
      minPrice,
      maxPrice,
      rating,
      sortOrder,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        query: searchQuery,
        ...(category && category !== "All Categories" && { category }),
        ...(location && { location }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(rating && { rating }),
        ...(sortOrder && { sort: sortOrder }),
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier/search?${params}`
      );
      return response.data;
    },
    enabled: searchType === "materials",
  });

  const handleSearchTypeChange = (type) => {
    const params = new URLSearchParams(searchParams);
    params.set("type", type);
    setSearchParams(params);
    setFilterType(type);
  };

  const handleFiltersChange = (newFilters) => {
    setIsMobileFiltersOpen(false);
  };

  const [isSortVisible, setIsSortVisible] = useState(false);
  const sortRef = useRef(null);

  const handleSortVisibility = () => {
    setIsSortVisible(!isSortVisible);
  };

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    setIsSortVisible(false);
  };

  const handleClickOutside = useCallback((e) => {
    if (sortRef.current && !sortRef.current.contains(e.target)) {
      setIsSortVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const isLoading = isProfessionalsLoading || isListingsLoading;
  const error = professionalsError || listingsError;

  const debouncedSetSearchParams = useCallback(
    createDebouncedSearch(searchParams, setSearchParams),
    [searchParams, setSearchParams]
  );

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInputValue(value);
    debouncedSetSearchParams(value);
  };

  console.log(filterType);

  return (
    <div className={styles.searchPage}>
      <FiltersSidebar
        onFiltersChange={handleFiltersChange}
        isMobile={window.innerWidth <= 768}
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        searchType={searchType}
      />

      <main className={styles.mainContent}>
        <div className={styles.searchBar}>
          <div className={styles.searchInput}>
            <select
              value={searchParams.get("type") || searchType}
              onChange={(e) => handleSearchTypeChange(e.target.value)}
              className={styles.searchType}
            >
              <option value="professionals">Professionals</option>
              <option value="materials">Materials</option>
            </select>
            <input
              type="text"
              placeholder="Search the building world"
              value={searchInputValue}
              onChange={handleSearchInput}
            />
          </div>

          <div className={styles.searchControls}>
            <button
              className={styles.filterButton}
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              Filters
            </button>

            <div className={styles.sortDropdown} ref={sortRef}>
              <button
                onClick={handleSortVisibility}
                className={styles.sortButton}
              >
                <BiSort /> Sort
              </button>
              {isSortVisible && (
                <div className={styles.sortOptions}>
                  <button
                    onClick={() => handleSortChange("recommended")}
                    className={sortOrder === "recommended" ? styles.active : ""}
                  >
                    Recommended
                  </button>
                  <button
                    onClick={() => handleSortChange("price-asc")}
                    className={sortOrder === "price-asc" ? styles.active : ""}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => handleSortChange("price-desc")}
                    className={sortOrder === "price-desc" ? styles.active : ""}
                  >
                    Price: High to Low
                  </button>
                  <button
                    onClick={() => handleSortChange("rating")}
                    className={sortOrder === "rating" ? styles.active : ""}
                  >
                    Highest Rated
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className={styles.error}>
            Error loading results. Please try again.
          </div>
        ) : (
          <div className={styles.resultsGrid}>
            {searchType === "professionals" ? (
              professionals.length === 0 ? (
                <div className={styles.noResults}>No professionals found</div>
              ) : (
                professionals.map((professional) => (
                  <ProfessionalCard
                    key={professional._id}
                    professional={professional}
                  />
                ))
              )
            ) : listings.length === 0 ? (
              <div className={styles.noResults}>No materials found</div>
            ) : (
              listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchPage;
