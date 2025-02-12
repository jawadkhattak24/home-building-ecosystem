import {useEffect, useState} from "react";
import styles from "./styles/supplierHome.module.scss";
import ListingCard from "../../components/listingCard/listingCard";
import {useAuth} from "../../contexts/authContext";
import axios from "axios";
import {useParams} from "react-router-dom";
import {FaPencilAlt} from "react-icons/fa";

const SupplierHome = () => {

    const {currentUser} = useAuth();
    const currentUserId = currentUser.id || currentUser._id;
    const [listings, setListings] = useState([]);
    const {supplierId} = useParams();
    const [supplierDataNew, setSupplierDataNew] = useState();

    useEffect(() => {
        const fetchSupplierData = async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/supplier/getSupplier/${supplierId}`)
            setSupplierDataNew(res.data);
            console.log("Supplier Data: ", supplierDataNew);
        }
        fetchSupplierData();
    }, [])


    const professionalId = currentUser.profileComplete._id;

    const supplierData = {
        businessName: "Light Palace",
        rating: 4.5,
        coverImage: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        logo: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        businessType: "Retailer",
        businessDescription: "BuildMaster Materials is a leading supplier of building materials, offering a wide range of products to meet the needs of the construction industry. We are a family-owned business that has been serving the community for over 50 years. We provide high quality products and services to our customers. We are committed to providing the best possible experience for our customers. ",
        totalListings: 12,
        availableStock: 4580,
        contact: {
            socialMedia: {
                facebook: "https://www.facebook.com/buildmaster",
                linkedin: "https://www.linkedin.com/company/buildmaster",
                instagram: "https://www.instagram.com/buildmaster",
            },
        },
        address: {
            street: "123 Main St", city: "Karachi", state: "Sindh", country: "Pakistan",
        },
    };

    useEffect(() => {
        document.title = "Supplier Home";
    }, []);


    useEffect(() => {
        const fetchListings = async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/supplier/listings/${currentUserId}`);
            setListings(response.data);
        };
        fetchListings();
    }, [currentUserId]);

    const [editMode, setEditMode] = useState(false);

    const handleEditToggle = () => {
        setEditMode(!editMode);

    }
    const handleImageUpload = async (event) => {
        console.log("Well");
        const file = event.target.files[0];
    }

    const [formData, setFormData] = useState({
        businessName: supplierData.businessName,
        businessDescription: supplierData.businessDescription,
        phone: supplierData.contact.phone,
        // email: supplierData.contact?.email,
    });

    console.log("Form Data: ", formData);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(preValues => ({
            ...preValues, [name]: value
        }));
    }

    const isOwner = currentUser.supplierProfileId === supplierId;


    const [notification, setNotification] = useState("");

    const handleSave = async () => {
        console.log("Form Data: ", formData)
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/supplier/update-profile/${professionalId}`,
                {formData: formData})

            if (response.status === 201) {
                setNotification("Profile updated successfully");
            }

        } catch (error) {
            console.error("An error occurred:", error);
        }
    }


    return (<div className={styles.supplierHomepage}>
        <header className={styles.header}>
            {/*<div className={styles.coverImageContainer}>*/}
            {/*    <img*/}
            {/*        className={styles.coverImage}*/}
            {/*        src={supplierData.coverImage}*/}
            {/*        alt="Supplier Cover"*/}
            {/*    />*/}

            {/*    {editMode && (*/}
            {/*        <label htmlFor="coverImage" className={styles.editCoverImageIcon}>*/}
            {/*            <FaPencilAlt/>*/}

            {/*            <input hidden type="file" accept="image/*" className={styles.coverImageInput}*/}
            {/*                   onChange={handleImageUpload}/>*/}
            {/*        </label>*/}
            {/*    )}*/}
            {/*</div>*/}
            <div className={styles.logoAndBrandingContainer}>
                <div className={styles.brandingWrapper}>

                    <div className={styles.logoContainer}>
                        {editMode && <label htmlFor="logo">
                            <FaPencilAlt/>
                            <input hidden className={styles.logoInputIcon} type="file" accept="image/*"
                                   onChange={handleImageUpload}/>
                        </label>}
                        <img src={supplierData.logo} alt="Supplier Logo"/>
                    </div>
                    <div className={styles.branding}>
                        {!editMode ? <h1>{supplierData.businessName}</h1> : (
                            <input name="businessName" className={styles.businessNameInput} onChange={handleChange}
                                   value={formData.businessName} type=" text"/>)}
                        <div className={styles.businessTypeAndRating}>

                            {!editMode ? (<span className={styles.businessType}>

                {supplierData.businessType}
              </span>) : (<select className={styles.businessTypeSelector} name="businessType" onChange={handleChange}>
                                    <option>Manufacturer</option>
                                    <option>Distributor</option>
                                    <option>Retailer</option>
                                </select>
                            )}
                            <span className={styles.rating}>★ {supplierData.rating}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.actionButtonsContainer}>
                    {!isOwner ? (

                        <button>Chat Now</button>
                    ) : (
                        <>
                            {editMode && (<button onClick={handleSave}>Save</button>)}
                            <button onClick={handleEditToggle}>{editMode ? "Cancel" : "Edit Profile"}</button>
                        </>
                    )}
                </div>
            </div>


            <div className={styles.businessInfoGrid}>
                <div className={styles.businessDescriptionContainer}>
                    <h3>About</h3>
                    {editMode ? (
                            <textarea name="businessDescription" className={styles.businessDescriptionTextarea}
                                      value={formData.businessDescription}
                                      onChange={handleChange}/>) :
                        <p>{supplierData.businessDescription}</p>
                    }
                </div>

                <div className={styles.addressAndContactContainer}>
                    <div className={styles.contactContainer}>
                        <div className={styles.contactInfo}>
                            <h3>Contact</h3>
                            {supplierData.contact.phone ?
                                <p>Phone: {supplierData.contact.phone} </p> : (editMode ? (
                                        <div className={styles.contactItemWrapper}>
                                            <p>Phone:</p>
                                            <input name="phone" onChange={handleChange} placeholder="+92312-3456789"
                                                   type="tel"/>
                                        </div>
                                    ) : ""
                                )}
                            {supplierData.contact.email ?
                                <p>Email: {supplierData.contact.email}</p> : (editMode ?
                                    <div className={styles.contactItemWrapper}>
                                        <p>Email: </p>
                                        <input name="email" onChange={handleChange} placeholder="Enter your email"
                                        />
                                    </div>
                                    : "")}
                            <div className={styles.socialMedia}>
                                <a href={supplierData.contact.socialMedia.facebook}>Facebook</a>
                                <a href={supplierData.contact.socialMedia.linkedin}>LinkedIn</a>
                                <a href={supplierData.contact.socialMedia.instagram}>
                                    Instagram
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className={styles.addressContainer}>
                        <h3>Address</h3>
                        <p>
                            {supplierData.address.street} {supplierData.address.city},{" "}
                            {supplierData.address.state} {supplierData.address.country}
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.listingsContainer}>
                <h3>Listings</h3>
                <div className={styles.mainListingsContainer}>
                    {listings.length > 0 ? (listings.map((listing) => (
                        <ListingCard key={listing._id} listing={listing}/>))) : (<p>No listings yet</p>)}
                </div>
            </div>

            <div className={styles.reviewsContainer}>
                <h3>Reviews</h3>
                <p>No reviews yet</p>
            </div>
        </header>


    </div>)
        ;
};

export default SupplierHome;
