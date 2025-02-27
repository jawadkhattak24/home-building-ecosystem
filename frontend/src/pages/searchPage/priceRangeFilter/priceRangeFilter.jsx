import { useState, useEffect, useCallback } from "react";
import styles from "./styles/priceRangeFilter.module.scss";

const PriceRangeFilter = ({
  minPrice = 0,
  maxPrice = 100000,
  onPriceChange,
  initialMin = 0,
  initialMax = 100000,
}) => {
  const [values, setValues] = useState({
    min: initialMin,
    max: initialMax,
  });

  const [isDragging, setIsDragging] = useState(null);

  const getPercentage = useCallback(
    (value) => {
      return ((value - minPrice) / (maxPrice - minPrice)) * 100;
    },
    [minPrice, maxPrice]
  );

  const formatPrice = (price) => {
    return `Rs. ${price.toFixed(0)}`;
  };

  const handleSliderChange = (e, type) => {
    const value = Number(e.target.value);
    let newValues = { ...values };

    if (type === "min") {
      newValues.min = Math.min(value, values.max - 1);
    } else {
      newValues.max = Math.max(value, values.min + 1);
    }

    setValues(newValues);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
    onPriceChange(values);
  };

  useEffect(() => {
    const rangeElement = document.querySelector(`.${styles.range}`);
    if (rangeElement) {
      const minPercent = getPercentage(values.min);
      const maxPercent = getPercentage(values.max);
      rangeElement.style.left = `${minPercent}%`;
      rangeElement.style.width = `${maxPercent - minPercent}%`;
    }
  }, [values, getPercentage]);

  console.log("Price Range: ", values.min, values.max);

  return (
    <div className={styles.priceRangeFilter}>
      <div className={styles.header}>
        <h3>Price Range</h3>
        <div className={styles.priceInputs}>
          <span>{formatPrice(values.min)}</span>
          <span>-</span>
          <span>{formatPrice(values.max)}</span>
        </div>
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.slider}>
          <div className={styles.track} />
          <div className={styles.range} />

          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={values.min}
            onChange={(e) => handleSliderChange(e, "min")}
            onMouseDown={() => setIsDragging("min")}
            onMouseUp={handleMouseUp}
            onTouchStart={() => setIsDragging("min")}
            onTouchEnd={handleMouseUp}
            className={styles.thumbLeft}
          />

          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={values.max}
            onChange={(e) => handleSliderChange(e, "max")}
            onMouseDown={() => setIsDragging("max")}
            onMouseUp={handleMouseUp}
            onTouchStart={() => setIsDragging("max")}
            onTouchEnd={handleMouseUp}
            className={styles.thumbRight}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
