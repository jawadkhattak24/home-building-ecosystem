import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  const token = localStorage.getItem("token");

  const { data: services = [], isLoading: isServicesLoading } = useQuery({
    queryKey: ["services", serviceType],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/service/category/${serviceType}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.filter((service) => service.userId !== null);
    },
    enabled: featuredSectionType === "service",
  });

  const { data: listings = [], isLoading: isListingsLoading } = useQuery({
    queryKey: ["listings", listingType],
    queryFn: async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/supplier/listings/category/${listingType}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    enabled: featuredSectionType !== "service",
  });

  const loading = isServicesLoading || isListingsLoading;

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
        {featuredSectionType === "service"
          ? "Featured" + " " + serviceType + "s"
          : "Featured" +
            " in " +
            listingType[0].toUpperCase() +
            listingType.slice(1)}
      </h2>
      <div className={styles.featuredServices_main_container}>
        <Slider {...settings}>
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={styles.slide}>
                  <SkeletonCard />
                </div>
              ))
            : featuredSectionType === "service" && Array.isArray(services)
            ? services.map((service, index) => (
                <div key={index} className={styles.slide}>
                  <ServiceCard professional={service} />
                </div>
              ))
            : Array.isArray(listings) && listings.length > 0
            ? listings.map((listing, index) => (
                <div key={index} className={styles.slide}>
                  <ListingCard listing={listing} />
                </div>
              ))
            : null}
        </Slider>
      </div>
    </div>
  );
}

export default FeaturedServicesSection;

FeaturedServicesSection.propTypes = {
  featuredSectionType: PropTypes.string.isRequired,
};
