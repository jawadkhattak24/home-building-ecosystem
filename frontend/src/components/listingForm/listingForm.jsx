import { useState } from "react";
import axios from "axios";
import styles from "./styles/listingForm.module.scss";

const materialConfig = {
  categories: {
    cement: {
      units: ["kg", "bag", "ton"],
      brands: ["Bestway", "Lucky Cement", "DG Khan", "Cherat", "Fauji"],
      specifications: ["type", "strength", "settingTime"],
    },
    tiles: {
      units: ["sqft", "box", "piece"],
      brands: ["Master Tiles", "Shabbir Tiles", "Shingran", "Shaw", "Shakur"],
      specifications: ["size", "material", "finish", "thickness"],
    },
    sanitary: {
      units: ["piece", "set"],
      brands: ["Duravit", "Toto", "American Standard", "Cera", "Parryware"],
      specifications: ["type", "color", "material", "installationType"],
    },
    steel: {
      units: ["kg", "ton", "piece"],
      brands: ["Amreli", "Agha Steel", "Ittehad", "Siddiqsons"],
      specifications: ["grade", "diameter", "length", "type"],
    },
    bricks: {
      units: ["piece", "1000 pcs"],
      brands: ["Thermopore", "Zia Thermal", "Globe", "Kryton"],
      specifications: ["type", "size", "compressiveStrength", "absorption"],
    },
    paint: {
      units: ["liter", "gallon", "kg"],
      brands: ["Berger", "Dulux", "Nippon", "Jotun", "Brighto"],
      specifications: ["type", "finish", "coverage", "dryTime"],
    },
    electrical: {
      units: ["piece", "meter", "set"],
      brands: ["KE", "Pak Cable", "Siemens", "ABB", "Hager"],
      specifications: ["voltage", "currentRating", "certification"],
    },
    lighting: {
      units: ["piece", "meter", "set"],
      brands: [
        "KE",
        "Pak Cable",
        "Siemens",
        "ABB",
        "Hager",
        "BrightGlow",
        "Lumière Royale",
        "Aurora Elegance",
        "HaloGlow"
      ],
      specifications: ["voltage", "currentRating", "certification"],
    },
  },
};

const ListingForm = ({
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  isEditing = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState(() => {
    if (isEditing && initialData) {
      return {
        ...initialData,
        imageFiles: [],
      };
    }

    const initialCategory = "cement";
    return {
      name: "",
      category: initialCategory,
      brand: "",
      description: "",

      price: {
        value: "",
        unit: materialConfig.categories[initialCategory].units[0],
        currency: "PKR",
      },
      stock: 0,
      availability: "in_stock",

      specifications: materialConfig.categories[
        initialCategory
      ].specifications.reduce((acc, spec) => ({ ...acc, [spec]: "" }), {}),

      images: [],
      imageFiles: [],
    };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep !== 4) {
      setCurrentStep((prev) => prev + 1);
      return;
    } else {
      setIsLoading(true);
    }

    const imageUrls = await uploadImages();

    const finalFormData = {
      ...formData,
      images: [...formData.images, ...imageUrls],
    };

    onSubmit(finalFormData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const categorySpecs = materialConfig.categories[newCategory];

    setFormData((prev) => ({
      ...prev,
      category: newCategory,
      price: {
        ...prev.price,
        unit: categorySpecs.units[0],
      },
      specifications: categorySpecs.specifications.reduce(
        (acc, spec) => ({ ...acc, [spec]: "" }),
        {}
      ),
      brand: "",
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files],
    }));
  };

  const uploadImages = async () => {
    const uploadedUrls = [];

    for (const file of formData.imageFiles) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/supplier/upload-image`,
          formData
        );

        const data = await response.data;
        uploadedUrls.push(data.imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    return uploadedUrls;
  };

  const getSpecificationPlaceholder = (spec, category) => {
    const placeholders = {
      cement: {
        type: "e.g., White Cement",
        strength: "e.g., 42.5 MPa, 52.5 MPa",
        settingTime: "e.g., 45 minutes initial set",
      },
      tiles: {
        size: "e.g., 60x60 cm, 30x30 cm",
        material: "e.g., Ceramic, Porcelain, Natural Stone",
        finish: "e.g., Glossy, Matt, Rustic",
        thickness: "e.g., 8mm, 10mm",
      },
      sanitary: {
        type: "e.g., Water Closet, Basin, Bathtub",
        color: "e.g., White, Bone, Black",
        material: "e.g., Vitreous China, Ceramic",
        installationType: "e.g., Floor Mounted, Wall Hung",
      },
      steel: {
        grade: "e.g., Grade 60, Grade 40",
        diameter: "e.g., 10mm, 12mm, 16mm",
        length: "e.g., 40 feet, 20 feet",
        type: "e.g., Deformed Bar, Plain Bar",
      },
      bricks: {
        type: "e.g., Clay Brick, Cement Brick",
        size: "e.g., 9x4.5x3 inches",
        compressiveStrength: "e.g., 2000 PSI, 3000 PSI",
        absorption: "e.g., 12%, 15%",
      },
      paint: {
        type: "e.g., Emulsion, Enamel, Weather Coat",
        finish: "e.g., Matt, Semi-gloss, Gloss",
        coverage: "e.g., 350 sq ft/gallon",
        dryTime: "e.g., 2-3 hours",
      },
      electrical: {
        voltage: "e.g., 220V, 110V",
        currentRating: "e.g., 13A, 15A, 20A",
        certification: "e.g., ISO, CE, UL",
      },
    };

    return placeholders[category]?.[spec] || `Enter ${spec}`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className={styles.formRow}>
              <label>Material Name</label>
              <input
                type="text"
                name="name"
                maxLength={30}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter material name (e.g., BrightGlow LED Bulbs)"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
              >
                {Object.keys(materialConfig.categories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formRow}>
              <label>Brand</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              >
                <option value="">Select Brand</option>
                {materialConfig.categories[formData.category].brands.map(
                  (brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className={styles.formRow}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your material's key features, quality, and usage. Include any special characteristics or applications."
                required
              />
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className={styles.formRow}>
              <label>Price</label>
              <div className={styles.priceInputGroup}>
                <input
                  type="number"
                  value={formData.price.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: { ...formData.price, value: e.target.value },
                    })
                  }
                  placeholder="Enter price (e.g., 1200)"
                  required
                />
                <select
                  value={formData.price.unit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: { ...formData.price, unit: e.target.value },
                    })
                  }
                >
                  {materialConfig.categories[formData.category].units.map(
                    (unit) => (
                      <option key={unit} value={unit}>
                        per {unit}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <label>Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter available quantity"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
              >
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="pre_order">Pre Order</option>
              </select>
            </div>
          </>
        );

      case 3:
        return (
          <>
            {Object.keys(formData.specifications).map((spec) => (
              <div className={styles.formRow} key={spec}>
                <label>{spec.charAt(0).toUpperCase() + spec.slice(1)}</label>
                {materialConfig.categories[formData.category]
                  .specificationsOptions?.[spec] ? (
                  <select
                    name={`specifications.${spec}`}
                    value={formData.specifications[spec]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          [spec]: e.target.value,
                        },
                      })
                    }
                    required
                  >
                    <option value="">Select {spec}</option>
                    {materialConfig.categories[
                      formData.category
                    ].specificationsOptions[spec].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name={`specifications.${spec}`}
                    value={formData.specifications[spec]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          [spec]: e.target.value,
                        },
                      })
                    }
                    placeholder={getSpecificationPlaceholder(
                      spec,
                      formData.category
                    )}
                    required
                  />
                )}
              </div>
            ))}
          </>
        );

      case 4:
        return (
          <div className={styles.formRow}>
            <label>Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.fileInput}
              placeholder="Upload clear, well-lit images of your product. Include multiple angles if possible."
            />
            <div className={styles.imagePreview}>
              {formData.imageFiles.map((file, index) => (
                <div key={index} className={styles.previewItem}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        imageFiles: prev.imageFiles.filter(
                          (_, i) => i !== index
                        ),
                      }));
                    }}
                    className={styles.removeImage}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.listingForm}>
        <div className={styles.formHeader}>
          <h2>
            {isEditing ? "Edit Listing" : "Create New Listing"} - Step{" "}
            {currentStep} of 4
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          <div className={styles.formActions}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className={styles.secondaryButton}
              >
                Previous
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className={styles.secondaryButton}
            >
              Cancel
            </button>
            <button
              disabled={currentStep === 4 && isLoading}
              type="submit"
              className={`${styles.primaryButton} ${
                isLoading ? styles.loading : ""
              } `}
            >
              {currentStep === 4
                ? isLoading
                  ? "Loading..."
                  : isEditing
                  ? "Update Listing"
                  : "Create Listing"
                : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;
