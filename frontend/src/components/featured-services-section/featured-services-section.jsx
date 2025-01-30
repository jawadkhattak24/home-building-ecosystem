import { useEffect, useState } from "react";
import ServiceCard from "../service-card/service-card";
import styles from "./styles/featured-services-section.module.scss";
import ListingCard from "../listingCard/listingCard";
import axios from "redaxios";
import SkeletonCard from "../skeleton-card/skeleton-card";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function FeaturedServicesSection({
  serviceType,
  listingType,
  featuredSectionType,
}) {
  const [services, setServices] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (featuredSectionType === "service") {
      async function fetchServicesByCategory(category) {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
          setLoading(true);
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/service/category/${category}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Professional Services:", response.data);

          const filteredServices = response.data.filter(
            (service) => service.userId !== null
          );
          setServices(filteredServices);
        } catch (error) {
          console.error("Error fetching featured services:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchServicesByCategory(serviceType);
    } else {
      async function fetchListings(category) {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
          setLoading(true);
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/supplier/listings/category/${category}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Listings:", response.data);

          setListings(response.data);
        } catch (error) {
          console.error("Error fetching listings:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchListings(listingType);
    }
  }, [serviceType, listingType, featuredSectionType]);

  const listingRendered = listings[0]?.name;
  console.log("Rendered: ", listingRendered);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.featuredServicesContainer}>
      <h2 style={{ marginLeft: 30, marginTop: 10 }}>
        Featured {serviceType !== undefined ? serviceType : listingType}
        {"s"}
      </h2>
      <div className={styles.featuredServices_main_container}>
        <Slider {...settings}>
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={styles.slide}>
                  <SkeletonCard />
                </div>
              ))
            : featuredSectionType === "service"
            ? services.map((service, index) => (
                <div key={index} className={styles.slide}>
                  <ServiceCard professional={service} />
                </div>
              ))
            : listings.map((listing, index) => (
                <div key={index} className={styles.slide}>
                  <ListingCard listing={listing} />
                </div>
              ))}
        </Slider>
      </div>
    </div>
  );
}

export default FeaturedServicesSection;

FeaturedServicesSection.propTypes = {
  featuredSectionType: PropTypes.string.isRequired,
};
