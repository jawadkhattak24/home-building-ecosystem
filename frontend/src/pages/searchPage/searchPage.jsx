import { useState, useEffect } from "react";
import styles from "./styles/searchPage.module.scss";
import ProfessionalCard from "../../components/service-card/service-card";
import ListingCard from "../../components/listingCard/listingCard";
import { ChevronDown } from "lucide-react";
import { BiSort } from "react-icons/bi";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [searchType, setSearchType] = useState("professionals");
  const [searchQuery, setSearchQuery] = useState(query || "");
  console.log(query);
  const [searchCategory, setSearchCategory] = useState("");

  // setSearchQuery(query);

  const [professionals, setProfessionals] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (query) {
      fetchProfessionals();
    }
  }, [query]);

  const fetchProfessionals = async () => {
    try {
      setProfessionals([]);
      console.log("Triggering fetch");
      console.log("Fetching professionals...");
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/service/search?query=${searchQuery}`
      );
      setProfessionals(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching professionals:", error);
    }
  };

  const fetchListings = async () => {
    try {
      setListings([]);
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/supplier/search?query=${searchQuery}`
      );
      console.log("Response:", response.data);
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchType === "professionals") {
        fetchProfessionals();
      } else {
        fetchListings();
      }
    }
  };

  return (
    <div className={styles.searchPage}>
      <aside className={styles.sidebar}>
        <div className={styles.filterSection}>
          <h3 className={styles.filterContainerLabel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 15"
              className={styles.filterButtonIcon}
            >
              <path
                d="M15.8,2H6.9C6.7,0.7,5.4-0.2,4,0.1C3,0.3,2.2,1,2,2H0.2C0.1,2,0,2.1,0,2.3v0.5
    C0,2.9,0.1,3,0.2,3H2C2.3,4.4,3.6,5.2,5,5c1-0.2,1.8-1,1.9-2h8.8C15.9,3,16,2.9,16,2.8V2.3C16,2.1,15.9,2,15.8,2z M4.5,4
    C3.7,4,3,3.3,3,2.5S3.7,1,4.5,1S6,1.7,6,2.5S5.3,4,4.5,4z"
              ></path>
              <path
                d="M15.8,12H8.9C8.7,10.7,7.4,9.8,6,10.1c-1,0.2-1.8,1-1.9,1.9H0.2C0.1,12,0,12.1,0,12.3v0.5
    C0,12.9,0.1,13,0.2,13h3.8C4.3,14.4,5.6,15.2,7,15c1-0.2,1.8-1,1.9-1.9h6.8c0.1,0,0.2-0.1,0.2-0.2v-0.5C16,12.1,15.9,12,15.8,12z
    M6.5,14C5.7,14,5,13.3,5,12.5S5.7,11,6.5,11S8,11.7,8,12.5S7.3,14,6.5,14z"
              ></path>
              <path
                d="M0,7.3v0.5C0,7.9,0.1,8,0.2,8h8.8c0.3,1.4,1.6,2.2,2.9,1.9c1-0.2,1.8-1,1.9-1.9h1.8
    C15.9,8,16,7.9,16,7.8V7.3C16,7.1,15.9,7,15.8,7h-1.8c-0.3-1.3-1.6-2.2-2.9-1.9C10,5.3,9.2,6,9.1,7H0.2C0.1,7,0,7.1,0,7.3z
    M10,7.5 C10,6.7,10.7,6,11.5,6S13,6.7,13,7.5S12.3,9,11.5,9S10,8.3,10,7.5z"
              ></path>
            </svg>
            Filter
          </h3>

          <div className={styles.filterItem}>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18.053 18"
                aria-hidden="true"
                className={styles.filterButtonIcon}
              >
                <g>
                  <g
                    fill="none"
                    stroke="#707070"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.125"
                    transform="translate(.603 .563)"
                  >
                    <rect width="6.75" height="6.75" rx=".75"></rect>
                    <circle
                      cx="3.375"
                      cy="3.375"
                      r="3.375"
                      transform="translate(10.125)"
                    ></circle>
                    <path d="M13.527 9.92a.665.665 0 0 0-1.179 0l-3.252 5.855a.77.77 0 0 0-.005.732.679.679 0 0 0 .595.368h6.505a.679.679 0 0 0 .595-.368.77.77 0 0 0-.005-.732Z"></path>
                    <path d="M3.826 9.213a.584.584 0 0 0-.9 0L.144 12.537a.62.62 0 0 0 0 .794l2.781 3.328a.583.583 0 0 0 .9 0l2.781-3.322a.62.62 0 0 0 0-.794Z"></path>
                  </g>
                </g>
              </svg>
              Categories
            </div>
            <ChevronDown />
          </div>
          <div className={styles.filterItem}>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16.875 18"
                aria-hidden="true"
                className={styles.filterButtonIcon}
              >
                <g>
                  <g
                    fill="none"
                    stroke="#707070"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.125"
                    transform="translate(.563 .563)"
                  >
                    <circle
                      cx="2.25"
                      cy="2.25"
                      r="2.25"
                      transform="translate(5.625 2.813)"
                    ></circle>
                    <path d="M7.875 0a5.063 5.063 0 0 1 5.063 5.063c0 2.438-3.849 7.9-4.835 9.253a.283.283 0 0 1-.456 0C6.661 12.957 2.813 7.5 2.813 5.062A5.063 5.063 0 0 1 7.875 0Z"></path>
                    <path d="M12.359 12.775c2.049.406 3.391 1.083 3.391 1.849 0 1.243-3.525 2.25-7.875 2.25S0 15.867 0 14.624c0-.765 1.336-1.441 3.375-1.847"></path>
                  </g>
                </g>
              </svg>
              Location
            </div>
            <ChevronDown />
          </div>
          <div className={styles.filterItem}>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="-5.0 -10.0 110.0 135.0"
                className={styles.filterButtonIcon}
              >
                <path d="m70.391 1.5625c-3.0078 0-5.6328 1.8359-7.418 4.5156s-2.832 6.2617-2.832 10.191c0 0.35547 0.011719 0.70703 0.027344 1.0547l-13.504-0.011719c-1.9453 0-3.8203 0.76953-5.1992 2.1523l-37.723 37.723c-2.8594 2.8594-2.8594 7.5391 0 10.398l28.664 28.66c2.8633 2.8633 7.543 2.8633 10.398 0l0.91797-0.91797c1.3242 1.875 3.5039 3.1094 5.957 3.1094h41.441c4.0117 0 7.2852-3.2812 7.2852-7.2852l-0.003906-53.867c0-2.25-0.92188-4.4023-2.5391-5.957l-12.23-11.711c-0.875-0.83594-1.918-1.4531-3.043-1.8359 0.035156-0.49609 0.054687-1 0.054687-1.5078 0-3.9297-1.0469-7.5117-2.832-10.191-1.7852-2.6797-4.4141-4.5156-7.4219-4.5156zm0 2.7461c1.8945 0 3.707 1.1484 5.1367 3.293 1.4297 2.1445 2.3711 5.2344 2.3711 8.668 0 0.35547-0.011719 0.71094-0.03125 1.0586h-14.949c-0.019531-0.35156-0.03125-0.70312-0.03125-1.0586 0-3.4375 0.94141-6.5234 2.3711-8.668 1.4297-2.1445 3.2422-3.293 5.1367-3.293zm-23.727 15.75 10.023 0.007812-11.758 11.258v0.003906l-0.003907 0.003906c-0.007812 0.007813-0.015625 0.015625-0.023437 0.023438-1.3789 1.3281-2.2305 3.0859-2.4531 4.9648-0.003907 0.042969-0.015625 0.082032-0.019531 0.125-0.027344 0.27734-0.042969 0.55469-0.042969 0.83594v53.867c0 0.50391 0.050781 1 0.15234 1.4766l-1.6797 1.6797v0.003906c-1.8047 1.8086-4.6992 1.8125-6.5117 0l-28.664-28.664c-1.8125-1.8125-1.8125-4.7031 0-6.5156l37.723-37.723c0.86328-0.86328 2.0352-1.3477 3.2578-1.3477zm16.195 0.015625h14.637c-0.40625 1.8828-1.0938 3.5508-1.9688 4.8633-0.16406 0.24219-0.33203 0.47266-0.50391 0.69141-1.125-1.3086-2.7852-2.1445-4.6328-2.1445-3.3633 0-6.1172 2.7578-6.1172 6.1172 0 3.3633 2.7539 6.1172 6.1172 6.1172 3.3672 0 6.1172-2.7578 6.1172-6.1172 0-0.46094-0.058593-0.91016-0.15625-1.3398 0.53125-0.53906 1.0195-1.1445 1.457-1.8047 1.1055-1.6602 1.9297-3.668 2.3945-5.8906 0.55859 0.25391 1.0781 0.59766 1.5273 1.0273l12.23 11.711c1.0781 1.0352 1.6953 2.4727 1.6953 3.9727v53.867c0 2.5234-2.0117 4.5391-4.5391 4.5391l-41.441 0.007812c-2.1367 0-3.8984-1.4492-4.3906-3.4297-0.023437-0.089844-0.050781-0.17578-0.066406-0.26953-0.050781-0.27344-0.085938-0.55469-0.085938-0.84375v-53.863c0-1.4961 0.61328-2.9258 1.6914-3.9727h0.003906l0.003906-0.003906 12.223-11.707c0.76562-0.73437 1.7266-1.2266 2.7539-1.4258h0.003906c0.33984-0.066406 0.69141-0.10156 1.043-0.10156zm7.5312 6.1562c1.0625 0 1.9883 0.48828 2.6055 1.2422-0.82812 0.5-1.707 0.76172-2.6055 0.76172-0.36328 0-0.71094 0.14453-0.96875 0.39844-0.25781 0.25781-0.40234 0.60938-0.40234 0.97266 0 0.75781 0.61328 1.3711 1.3711 1.3711 1.1719 0 2.2852-0.28125 3.3164-0.78125-0.27344 1.5898-1.6328 2.7812-3.3164 2.7812-1.8789 0-3.3711-1.4961-3.3711-3.375 0-1.8789 1.4961-3.375 3.3711-3.375zm0 19.562c-10.645 0-19.305 8.6602-19.305 19.305 0 10.645 8.6602 19.305 19.305 19.305s19.305-8.6602 19.305-19.305c0-10.645-8.6602-19.305-19.305-19.305zm0 2.7461c9.1602 0 16.559 7.3984 16.559 16.559s-7.3984 16.559-16.559 16.559-16.559-7.3984-16.559-16.559 7.3984-16.559 16.559-16.559zm0 4.6367c-0.75781 0-1.3711 0.61719-1.3711 1.375v1.4648h-0.40625c-2.875 0-5.2305 2.3594-5.2305 5.2305 0 2.875 2.3594 5.2305 5.2305 5.2305h3.5703c1.3945 0 2.4883 1.0938 2.4883 2.4883 0 1.3945-1.0938 2.4883-2.4883 2.4883h-1.6562c-0.042969-0.003906-0.089844-0.007813-0.13672-0.007813-0.027344 0.003907-0.054687 0.003907-0.085937 0.007813h-1.6719c-1.1758 0-2.2266-0.76562-2.5859-1.8867h0.003906c-0.23047-0.71875-1.0039-1.1172-1.7266-0.88672-0.72266 0.23437-1.1172 1.0039-0.88672 1.7266 0.72266 2.25 2.832 3.793 5.1992 3.793h0.38281v1.4492c0 0.75781 0.61328 1.375 1.3711 1.375 0.36328 0 0.71484-0.14453 0.97266-0.40234 0.25781-0.25781 0.40234-0.60547 0.40234-0.97266v-1.4492h0.41797c2.875 0 5.2305-2.3594 5.2305-5.2305 0-2.875-2.3594-5.2305-5.2305-5.2305h-3.5703c-1.3945 0-2.4883-1.0938-2.4883-2.4883s1.0938-2.4883 2.4883-2.4883h3.5469c1.1797 0 2.2227 0.75391 2.582 1.8828h-0.003907c0.11328 0.34766 0.35547 0.63672 0.67969 0.80469s0.69922 0.19922 1.0469 0.085937c0.72266-0.23047 1.1211-1 0.89062-1.7227-0.72266-2.2578-2.8359-3.793-5.1992-3.793h-0.39062v-1.4688c0-0.36328-0.14453-0.71484-0.40234-0.97266-0.25781-0.25781-0.60938-0.40234-0.97266-0.40234z" />
              </svg>
              Price Range
            </div>
            <ChevronDown />
          </div>
          <div className={styles.filterItem}>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="-5.0 -10.0 110.0 135.0"
                //   style={{ width: "30px", height: "30px" }}
                className={styles.filterButtonIcon}
              >
                <path d="m84.477 41.691c-0.71484-2.1953-2.5781-3.7383-4.8672-4.0234l-16.996-2.1367-7.2852-15.504c-0.98047-2.0898-3.0234-3.3867-5.332-3.3867s-4.3516 1.2969-5.332 3.3867l-7.2852 15.504-16.992 2.1367c-2.2891 0.28516-4.1562 1.8281-4.8672 4.0234-0.71484 2.1953-0.10938 4.5391 1.5703 6.1172l12.492 11.719-3.2188 16.824c-0.43359 2.2656 0.45703 4.5156 2.3242 5.8711 1.8672 1.3555 4.2812 1.5078 6.3047 0.39453l15.004-8.2617 15.004 8.2617c0.89844 0.49609 1.875 0.73828 2.8477 0.73828 1.2148 0 2.418-0.38281 3.4531-1.1328 1.8672-1.3555 2.7578-3.6055 2.3242-5.8711l-3.2188-16.824 12.492-11.719c1.6836-1.5781 2.2852-3.9219 1.5703-6.1172zm-19.297 14.637c-0.73828 0.69141-1.0703 1.7188-0.88281 2.7109l3.5156 18.379-16.391-9.0234c-0.88672-0.48828-1.9648-0.48828-2.8516 0l-16.391 9.0234 3.5156-18.379c0.19141-0.99609-0.14062-2.0195-0.88281-2.7109l-13.648-12.801 18.562-2.3359c1.0039-0.125 1.875-0.75781 2.3086-1.6758l7.957-16.934 7.957 16.934c0.42969 0.91797 1.3008 1.5508 2.3086 1.6758l18.562 2.3359-13.648 12.801z" />
              </svg>
              Rating
            </div>
            <ChevronDown />
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.searchBar}>
          <div className={styles.searchInput}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 12 12"
              aria-labelledby="IconBase-title-8f46da7f-207f-4224-95cb-e741d5d98fbf IconBase-description-8f46da7f-207f-4224-95cb-e741d5d98fbf"
              role="graphics-symbol img"
              width="100%"
              height="100%"
              className={styles.searchIcon}
              aria-hidden="true"
            >
              <title id="IconBase-title-8f46da7f-207f-4224-95cb-e741d5d98fbf">
                search
              </title>
              <desc id="IconBase-description-8f46da7f-207f-4224-95cb-e741d5d98fbf">
                magnifying glass
              </desc>
              <g>
                <path d="M11.407,10.421,8.818,7.832a4.276,4.276,0,1,0-.985.985l2.589,2.589a.7.7,0,0,0,.985-.985ZM2.355,5.352a3,3,0,1,1,3,3,3,3,0,0,1-3-3Z"></path>
              </g>
            </svg>

            <input
              type="text"
              placeholder="Search the building world"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className={styles.searchType}
            >
              <option value="professionals">Professionals</option>
              <option value="materials">Materials</option>
            </select>
          </div>
          <button className={styles.sortButton}>
            <BiSort /> Sort
          </button>
        </div>

        <div className={styles.resultsGrid}>
          {searchType === "professionals" &&
            professionals.map((professional) => (
              <ProfessionalCard
                professional={professional}
                key={professional._id}
              />
            ))}
          {searchType === "materials" &&
            listings.map((listing) => (
              <ListingCard listing={listing} key={listing._id} />
            ))}
        </div>
      </main>
    </div>
  );
}

export default SearchPage;
