import { useState, useEffect, useRef } from "react";
import styles from "./styles/locationFilter.module.scss";

const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Faisalabad",
  "Rawalpindi",
  "Gujranwala",
  "Peshawar",
  "Multan",
  "Hyderabad",
  "Islamabad",
  "Quetta",
  "Bahawalpur",
  "Sargodha",
  "Sialkot",
  "Sukkur",
  "Larkana",
  "Sheikhupura",
  "Bhimber",
  "Jhang",
  "Dera Ghazi Khan",
  "Gujrat",
];

const LocationFilter = ({ selectedLocation, onLocationChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(selectedLocation || "");
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  const filterCities = (query) => {
    if (!query) {
      return PAKISTAN_CITIES;
    }

    const normalizedQuery = query.toLowerCase();
    return PAKISTAN_CITIES.filter((city) =>
      city.toLowerCase().includes(normalizedQuery)
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
    setSuggestions(filterCities(value));
  };

  const handleSelectLocation = (city) => {
    setSearchTerm(city);
    onLocationChange(city);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.locationFilter} ref={inputRef}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            setSuggestions(filterCities(searchTerm));
          }}
          placeholder="Enter city name..."
          className={styles.locationInput}
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className={styles.suggestionsList}>
          {suggestions.map((city) => (
            <div
              key={city}
              className={styles.suggestionItem}
              onClick={() => handleSelectLocation(city)}
            >
              <span className={styles.mainText}>{city}</span>
              <span className={styles.subText}>Pakistan</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationFilter;
