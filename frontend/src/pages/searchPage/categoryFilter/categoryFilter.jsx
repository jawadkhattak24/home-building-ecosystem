import { useState } from "react";
import styles from "./styles/categoryFilter.module.scss";

const serviceCategories = [
  "All Categories",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Masonry",
  "Painting",
  "Landscaping",
  "Interior Design",
  "Architecture",
  "HVAC",
];

const listingCategories = [
  "All Categories",
  "Cement",
  "Sanitary",
  "Tiles",
  "Wood",
  "Furniture",
  "Electrical",
  "Paint",
  "Metal",
  "Glass",
  "Plastic",
  "Other",
];

const CategoryFilter = ({ selectedCategory, onCategoryChange, searchType }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.categoryFilter}>
      <div className={styles.categoryHeader} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedCategory || "All Categories"}</span>
        <svg
          className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>

      {isOpen && (
        <div className={styles.categoryList}>
          {searchType === "professionals"
            ? serviceCategories.map((category) => (
                <div
                  key={category}
                  className={`${styles.categoryItem} ${
                    selectedCategory === category ? styles.selected : ""
                  }`}
                  onClick={() => {
                    onCategoryChange(category);
                    setIsOpen(false);
                  }}
                >
                  {category}
                </div>
              ))
            : listingCategories.map((category) => (
                <div
                  key={category}
                  className={`${styles.categoryItem} ${
                    selectedCategory === category ? styles.selected : ""
                  }`}
                  onClick={() => {
                    onCategoryChange(category);
                    setIsOpen(false);
                  }}
                >
                  {category}
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
