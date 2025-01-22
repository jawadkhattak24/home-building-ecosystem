import { useState } from "react";
import styles from "./styles/listingForm.module.scss";

const ListingForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'cement',
    description: '',
    price: { value: '', unit: 'kg', currency: 'INR' },
    specifications: {},
    images: [],
    stock: 0,
    availability: 'in_stock'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.listingForm}>
        <div className={styles.formHeader}>
          <h2>Create New Listing</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label>Material Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formRow}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="cement">Cement</option>
              <option value="tiles">Tiles</option>
              <option value="paint">Paint</option>
              {/* Add other categories */}
            </select>
          </div>

          <div className={styles.formRow}>
            <label>Price</label>
            <div className={styles.priceInputGroup}>
              <input
                type="number"
                value={formData.price.value}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, value: e.target.value }
                })}
                required
              />
              <select
                value={formData.price.unit}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, unit: e.target.value }
                })}
              >
                <option value="kg">per kg</option>
                <option value="sqft">per sqft</option>
                <option value="piece">per piece</option>
              </select>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton}>
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;