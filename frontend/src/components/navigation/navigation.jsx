import { Link, useNavigate } from "react-router-dom";
import styles from "./styles/navigation.module.scss";
import { useAuth } from "../../contexts/authContext";
import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronDownIcon } from "lucide-react";
import axios from "axios";
import { useLoading } from "../../contexts/loadingContext";
import { FaEnvelope, FaHeart } from "react-icons/fa";
import {
  FaHardHat,
  FaPaintBrush,
  FaTools,
  FaHome,
  FaStore,
  FaLightbulb,
  FaTree,
  FaWrench,
  FaTint,
  FaBath,
  FaCouch,
} from "react-icons/fa";
import { MdDesignServices, MdOutlineArchitecture } from "react-icons/md";

const Navigation = () => {
  const { currentUser, logout, globalUserType, setGlobalUserType } = useAuth();
  console.log("Current user in navigation:", currentUser);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const avatarMenuRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("professionals");

  console.log("Search type in navigation:", searchType);
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const megaMenuData = {
    professionals: [
      {
        title: "Design & Planning",
        items: [
          {
            icon: <MdOutlineArchitecture />,
            title: "Architects",
            description: "Expert architectural design and planning",
            link: "/search?query=architect&type=professionals",
          },
          {
            icon: <MdDesignServices />,
            title: "Interior Designers",
            description: "Transform your interior spaces",
            link: "/search?query=interior+designer&type=professionals",
          },
          {
            icon: <FaTree />,
            title: "Landscape Architects",
            description: "Create beautiful outdoor spaces",
            link: "/search?query=landscaper&type=professionals",
          },
        ],
      },
      {
        title: "Construction",
        items: [
          {
            icon: <FaHardHat />,
            title: "General Contractors",
            description: "Manage your entire project",
            link: "/search?query=contractor&type=professionals",
          },
          {
            icon: <FaTools />,
            title: "Carpenters",
            description: "Custom woodwork and installations",
            link: "/search?query=carpenter&type=professionals",
          },
          {
            icon: <FaWrench />,
            title: "HVAC Specialists",
            description: "Heating and cooling solutions",
            link: "/search?query=hvac&type=professionals",
          },
        ],
      },
      {
        title: "Specialized Services",
        items: [
          {
            icon: <FaTint />,
            title: "Plumbers",
            description: "Professional plumbing services",
            link: "/search?query=plumber&type=professionals",
          },
          {
            icon: <FaLightbulb />,
            title: "Electricians",
            description: "Electrical installation and repair",
            link: "/search?query=electrician&type=professionals",
          },
          {
            icon: <FaPaintBrush />,
            title: "Painters",
            description: "Professional painting services",
            link: "/search?query=painter&type=professionals",
          },
        ],
      },
    ],
    materials: [
      {
        title: "Building Materials",
        items: [
          {
            icon: <FaHome />,
            title: "Construction Materials",
            description: "Foundation to finishing materials",
            link: "/search?query=construction&type=materials",
          },
          {
            icon: <FaStore />,
            title: "Hardware & Tools",
            description: "Quality tools and hardware supplies",
            link: "/search?query=hardware&type=materials",
          },
          {
            icon: <FaPaintBrush />,
            title: "Paint & Finishes",
            description: "Wide range of colors and finishes",
            link: "/search?query=paint&type=materials",
          },
        ],
      },
      {
        title: "Interior Finishes",
        items: [
          {
            icon: <FaCouch />,
            title: "Furniture & Decor",
            description: "Stylish home furnishings",
            link: "/search?query=furniture&type=materials",
          },
          {
            icon: <FaLightbulb />,
            title: "Lighting",
            description: "Modern lighting solutions",
            link: "/search?query=lighting&type=materials",
          },
          {
            icon: <FaBath />,
            title: "Bathroom & Kitchen",
            description: "Fixtures and fittings",
            link: "/search?query=sanitary&type=materials",
          },
        ],
      },
      {
        title: "Outdoor & Landscaping",
        items: [
          {
            icon: <FaTree />,
            title: "Garden & Landscaping",
            description: "Outdoor and garden supplies",
            link: "/search?query=garden&type=materials",
          },
          {
            icon: <FaHome />,
            title: "Outdoor Living",
            description: "Patios and outdoor spaces",
            link: "/search?query=outdoor&type=materials",
          },
          {
            icon: <FaLightbulb />,
            title: "Outdoor Lighting",
            description: "Landscape lighting solutions",
            link: "/search?query=outdoor+lighting&type=materials",
          },
        ],
      },
    ],
  };

  const toggleAvatarMenu = () => {
    setShowAvatarMenu(!showAvatarMenu);
  };

  useEffect(() => {
    console.log("User type changed:", globalUserType);
    localStorage.setItem("userType", globalUserType);
  }, [globalUserType]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target)
      ) {
        setShowAvatarMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isSwitching) {
      document.body.classList.add("switching");
    } else {
      document.body.classList.remove("switching");
    }
  }, [isSwitching]);

  // const checkProfileSetup = async () => {
  //   const response = await axios.get(
  //     `${import.meta.env.VITE_API_URL}/api/user/check-profile-setup/${
  //       currentUser.id
  //     }`
  //   );
  //   return response.data.isProfileSetup;
  // };

  // const setupProfile = async (userId, userType) => {
  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_API_URL}/api/user/setup-profile/${userId}`,
  //       { userType }
  //     );
  //     return response.data.isProfileSetup;
  //   } catch (error) {
  //     console.error("Error setting up profile", error);
  //   }
  // };

  const handleUserTypeSwitch = async (userType) => {
    setShowAvatarMenu(false);
    setIsLoading(true);
    setIsSwitching(true);

    console.log("Switching user type to:", userType);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/switch-userType/${
          currentUser.id
        }`,
        { userType: userType }
      );
      console.log("Response:", response.data);

      currentUser.userType = response.data.user.userType;
      setGlobalUserType(response.data.user.userType);

      console.log("User data", currentUser);

      if (response.status === 200) {
        setTimeout(() => {
          if (response.data.user.userType === "supplier") {
            navigate(
              `/supplier-homepage/${response.data.user.supplierProfileId}`
            );
          } else if (response.data.user.userType === "professional") {
            navigate(`/professional-profile/${currentUser.id}`);
          } else {
            navigate("/");
          }
        }, 300);
      }
    } catch (error) {
      console.error("Error switching user type:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsSwitching(false);
      }, 600);
    }
  };

  const handleSearchInput = useCallback(
    (query, searchType) => {
      console.log("Search type:", searchType);
      navigate(`/search?query=${query}&type=${searchType}`);
    },
    [navigate]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "Enter" &&
        e.target.matches('[data-testid="navigation-search-input"]')
      ) {
        handleSearchInput(e.target.value, searchType);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchType, handleSearchInput]);

  const loginRegisterNav = () => {
    return (
      <>
        <Link to="/login" className={styles.loginBtn}>
          Login
        </Link>
        <Link to="/register" className={styles.registerBtn}>
          Register
        </Link>
      </>
    );
  };

  const avatarMenu = () => {
    return (
      <>
        <div className={styles.avatar_menu}>
          <Link
            to={
              currentUser.userType === "homeowner"
                ? `/homeowner-profile/${currentUser.id}`
                : currentUser.userType === "professional"
                ? `/professional-profile/${currentUser.professionalId}`
                : `/supplier-homepage/${currentUser.supplierProfileId}`
            }
            className={styles.avatar_menu_item}
            onClick={() => setShowAvatarMenu(false)}
          >
            <i className="fas fa-user"></i> Profile
          </Link>

          {currentUser.userType !== "supplier" && (
            <button
              className={`${styles.avatar_menu_item} ${
                isSwitching ? styles.switching : ""
              }`}
              onClick={() => handleUserTypeSwitch("supplier")}
              disabled={isSwitching}
            >
              <i className="fas fa-cog"></i> Switch to Supplier
            </button>
          )}

          {currentUser.userType !== "professional" && (
            <button
              className={`${styles.avatar_menu_item} ${
                isSwitching ? styles.switching : ""
              }`}
              onClick={() => handleUserTypeSwitch("professional")}
              disabled={isSwitching}
            >
              <i className="fas fa-cog"></i> Switch to Professional
            </button>
          )}

          {currentUser.userType !== "homeowner" && (
            <button
              className={`${styles.avatar_menu_item} ${
                isSwitching ? styles.switching : ""
              }`}
              onClick={() => handleUserTypeSwitch("homeowner")}
              disabled={isSwitching}
            >
              <i className="fas fa-home"></i> Switch to Homeowner
            </button>
          )}

          <button className={styles.avatar_menu_item} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </>
    );
  };

  const handleSearchClick = (query) => {
    navigate(`/search?query=${query}&type=professionals`);
  };

  const renderMegaDropdown = (type) => {
    const data = megaMenuData[type];
    if (!data) return null;

    return (
      <div
        className={`${styles.megaDropdown} ${
          activeDropdown === type ? styles.megaDropdownVisible : ""
        }`}
      >
        <div className={styles.megaDropdownContent}>
          {data.map((section, index) => (
            <div key={index} className={styles.megaDropdownSection}>
              <h2>{section.title}</h2>
              {section.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  to={item.link}
                  className={styles.megaDropdownItem}
                  onClick={() => setActiveDropdown(null)}
                >
                  <div className={styles.categoryIcon}>{item.icon}</div>
                  <div className={styles.categoryContent}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleNavTrigger = (type) => {
    if (activeDropdown === type) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(type);
    }
  };

  const navigationLinks = () => (
    <div className={styles.navTriggerContainer}>
      <button
        className={`${styles.navTrigger} ${
          activeDropdown === "professionals" ? styles.active : ""
        }`}
        onClick={() => handleNavTrigger("professionals")}
      >
        Hire Professionals <ChevronDownIcon size={16} />
      </button>
      <button
        className={`${styles.navTrigger} ${
          activeDropdown === "materials" ? styles.active : ""
        }`}
        onClick={() => handleNavTrigger("materials")}
      >
        Find Materials <ChevronDownIcon size={16} />
      </button>
      {renderMegaDropdown("professionals")}
      {renderMegaDropdown("materials")}
    </div>
  );

  const publicNav = () => {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            Home Building Ecosystem
          </Link>
          <nav className={styles.nav}>
            {navigationLinks()}
            {loginRegisterNav()}
          </nav>
        </div>
      </header>
    );
  };

  const homeownerNav = () => {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            Home Building Ecosystem
          </Link>
          <nav className={styles.nav}>
            {navigationLinks()}
            <div className={styles.searchBar}>
              <div className={styles.searchInput}>
                <div className={styles.customSelect}>
                  <select
                    value={searchType}
                    onChange={(e) => {
                      setSearchType(e.target.value);
                    }}
                  >
                    <option value="professionals">Professionals</option>
                    <option value="materials">Materials</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Search the building world"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchInput(searchQuery, searchType);
                    }
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 12 12"
                  aria-labelledby="IconBase-title-8f46da7f-207f-4224-95cb-e741d5d98fbf IconBase-description-8f46da7f-207f-4224-95cb-e741d5d98fbf"
                  role="graphics-symbol img"
                  width="100%"
                  height="100%"
                  className={styles.searchIcon}
                  aria-hidden="true"
                  onClick={() => handleSearchInput(searchQuery, searchType)}
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
              </div>
            </div>
            {currentUser && (
              <>
                <Link to="/inbox" className={styles.navEnvelope}>
                  <FaEnvelope size={20} />
                </Link>
                <Link to="/saved-items" className={styles.navHeart}>
                  <FaHeart size={20} />
                </Link>
              </>
            )}
            {!currentUser && loginRegisterNav()}
            {currentUser && (
              <div className={styles.avatar_container} ref={avatarMenuRef}>
                <button
                  className={styles.avatar_button}
                  onClick={toggleAvatarMenu}
                >
                  <img
                    src={currentUser.profilePictureUrl}
                    alt={currentUser.username}
                    className={styles.avatar_image}
                  />
                </button>
                {showAvatarMenu && avatarMenu()}
              </div>
            )}
          </nav>
        </div>
      </header>
    );
  };

  const professionalNav = () => {
    return (
      <>
        <header className={styles.header}>
          <div className={styles.container}>
            <Link to="/" className={styles.logo}>
              Home Building Ecosystem
            </Link>

            <nav className={styles.professionalNav}>
              <>
                <Link to="/inbox" className={styles.navLink}>
                  Messages
                </Link>
                {/* <Link to="/professional/jobs" className={styles.navLink}>
                  Jobs
                </Link> */}
                <Link to="/analytics" className={styles.navLink}>
                  Analytics
                </Link>
                <Link
                  to={`/professional-profile/${currentUser?.id}`}
                  className={styles.navLink}
                >
                  Profile
                </Link>
              </>

              {!currentUser && loginRegisterNav()}

              {currentUser && (
                <div className={styles.avatar_container} ref={avatarMenuRef}>
                  <button
                    className={styles.avatar_button}
                    onClick={toggleAvatarMenu}
                  >
                    <img
                      src={currentUser.profilePictureUrl}
                      alt={currentUser.username}
                      className={styles.avatar_image}
                    />
                  </button>
                  {showAvatarMenu && avatarMenu()}
                </div>
              )}
            </nav>
          </div>
        </header>
      </>
    );
  };

  const supplierNav = () => {
    return (
      <>
        <header className={styles.header}>
          <div className={styles.container}>
            <Link to="/" className={styles.logo}>
              Home Building Ecosystem
            </Link>
            <nav className={styles.nav}>
              <Link
                to={`/supplier-homepage/${currentUser.supplierProfileId}`}
                className={styles.navLink}
              >
                Profile
              </Link>

              <Link to="/supplier-listings" className={styles.navLink}>
                Listings
              </Link>
              {/* <Link to="/supplier-analytics" className={styles.navLink}>
                Analytics
              </Link> */}
              <Link to="/inbox" className={styles.navLink}>
                Messages
              </Link>

              {currentUser && (
                <div className={styles.avatar_container} ref={avatarMenuRef}>
                  <button
                    className={styles.avatar_button}
                    onClick={toggleAvatarMenu}
                  >
                    <img
                      src={currentUser.profilePictureUrl}
                      alt={currentUser.username}
                      className={styles.avatar_image}
                    />
                  </button>
                  {showAvatarMenu && avatarMenu()}
                </div>
              )}
            </nav>
          </div>
        </header>
      </>
    );
  };

  const handleLogout = () => {
    setShowAvatarMenu(false);
    logout();
  };

  // if (isLoading) {
  //   return <LoadingUI />;
  // }

  // console.log("User type:", currentUser.userType);
  return (
    <>
      {!currentUser && publicNav()}
      {currentUser && currentUser.userType === "homeowner" && homeownerNav()}
      {currentUser &&
        currentUser.userType === "professional" &&
        professionalNav()}
      {currentUser && currentUser.userType === "supplier" && supplierNav()}
    </>
  );
};

export default Navigation;
