import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./styles/filtersSidebar.module.scss";

import CategoryFilter from "../categoryFilter/categoryFilter";
import LocationFilter from "../locationFilter/locationFilter";
import PriceRangeFilter from "../priceRangeFilter/priceRangeFilter";
import RatingFilter from "../ratingFilter/ratingFilter";

const FiltersSidebar = ({ onFiltersChange, isMobile, searchType }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(!isMobile);

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "All Categories",
    location: searchParams.get("location") || "",
    priceRange: {
      min: parseInt(searchParams.get("minPrice")) || 0,
      max: parseInt(searchParams.get("maxPrice")) || 100000,
    },
    rating: parseInt(searchParams.get("rating")) || 0,
  });

  const updateFilters = (newFilters) => {
    setFilters(newFilters);

    const params = new URLSearchParams(searchParams);

    if (newFilters.category && newFilters.category !== "All Categories") {
      params.set("category", newFilters.category);
    } else {
      params.delete("category");
    }

    if (newFilters.location) {
      params.set("location", newFilters.location);
    } else {
      params.delete("location");
    }

    if (newFilters.priceRange.min > 0) {
      params.set("minPrice", newFilters.priceRange.min);
    } else {
      params.delete("minPrice");
    }

    if (newFilters.priceRange.max < 100000) {
      params.set("maxPrice", newFilters.priceRange.max);
    } else {
      params.delete("maxPrice");
    }

    if (newFilters.rating > 0) {
      params.set("rating", newFilters.rating);
    } else {
      params.delete("rating");
    }

    setSearchParams(params);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      category: "All Categories",
      location: "",
      priceRange: { min: 0, max: 100000 },
      rating: 0,
    };
    updateFilters(clearedFilters);
  };

  const hasActiveFilters = () => {
    return (
      filters.category !== "All Categories" ||
      filters.location !== "" ||
      filters.priceRange.min > 0 ||
      filters.priceRange.max < 100000 ||
      filters.rating > 0
    );
  };

  return (
    <div className={`${styles.filtersSidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.filterHeader}>
        <h2>Filters</h2>
        {isMobile && (
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Close filters"
          >
            ×
          </button>
        )}
        {hasActiveFilters() && (
          <button className={styles.clearAllButton} onClick={handleClearAll}>
            Clear All
          </button>
        )}
      </div>

      <div className={styles.filtersContent}>
        <div className={styles.filterSection}>
          <CategoryFilter
            selectedCategory={filters.category}
            onCategoryChange={(category) =>
              updateFilters({ ...filters, category })
            }
            searchType={searchType}
          />
        </div>

        <div className={styles.filterSection}>
          <LocationFilter
            selectedLocation={filters.location}
            onLocationChange={(location) =>
              updateFilters({ ...filters, location })
            }
          />
        </div>

        <div className={styles.filterSection}>
          <PriceRangeFilter
            initialMin={filters.priceRange.min}
            initialMax={filters.priceRange.max}
            onPriceChange={(priceRange) =>
              updateFilters({ ...filters, priceRange })
            }
          />
        </div>

        <div className={styles.filterSection}>
          <RatingFilter
            initialRating={filters.rating}
            onRatingChange={(rating) => updateFilters({ ...filters, rating })}
          />
        </div>
      </div>

      {isMobile && (
        <div className={styles.mobileActions}>
          <button
            className={styles.applyButton}
            onClick={() => setIsOpen(false)}
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FiltersSidebar;
