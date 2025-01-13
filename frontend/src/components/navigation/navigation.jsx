import { Link } from "react-router-dom";
import styles from "./styles/navigation.module.scss";
import { useAuth } from "../../contexts/authContext";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLoading } from "../../contexts/loadingContext";

const Navigation = () => {
  const { currentUser, logout, globalUserType } = useAuth();
  const { setGlobalUserType } = useAuth();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const avatarMenuRef = useRef(null);
  const navigate = useNavigate();
  const { setIsLoading, isLoading, LoadingUI } = useLoading();

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

  const checkProfileSetup = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/user/check-profile-setup/${
        currentUser.id
      }`
    );
    return response.data.isProfileSetup;
  };

  const setupProfile = async (userId, userType) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/setup-profile/${userId}`,
        { userType }
      );
      return response.data.isProfileSetup;
    } catch (error) {
      console.error("Error setting up profile", error);
    }
  };

  const handleUserTypeSwitch = async (userType) => {
    setShowAvatarMenu(false);
    
    console.log("Switching user type to:", userType);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/switch-userType/${
          currentUser.id
        }`,
        { userType: userType }
      );

      setGlobalUserType(response.data.user.userType);

      if (response.status === 200) {
        if (response.data.user.userType === "supplier") {
          const isProfileSetup = await checkProfileSetup(userType);
          if (!isProfileSetup) {
            navigate("/supplier-profile/setup");
          } else {
            navigate("/supplier/home");
          }
        } else if (response.data.user.userType === "professional") {
          console.log("Checking professional profile setup");
          const isProfileSetup = await checkProfileSetup(userType);
          if (!isProfileSetup) {
            let profileSetupRes;
            try {
              profileSetupRes = await setupProfile(currentUser.id, userType);
            } catch (error) {
              console.error("Error setting up professional profile", error);
            }
            if (profileSetupRes.status === 200) {
              navigate(`/professional-profile/${currentUser.id}`);
            } else {
              console.error("Error setting up professional profile");
            }
          } else {
            navigate(`/professional-profile/${currentUser.id}`);
          }
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error switching to supplier", error);
    }
  };

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
            to={`/profile/${currentUser.id}`}
            className={styles.avatar_menu_item}
            onClick={() => setShowAvatarMenu(false)}
          >
            <i className="fas fa-user"></i> Profile
          </Link>

          {currentUser.userType !== "supplier" && (
            <button
              className={styles.avatar_menu_item}
              onClick={() => handleUserTypeSwitch("supplier")}
            >
              <i className="fas fa-cog"></i> Switch to Supplier
            </button>
          )}

          {currentUser.userType !== "professional" && (
            <button
              className={styles.avatar_menu_item}
              onClick={() => handleUserTypeSwitch("professional")}
            >
              <i className="fas fa-cog"></i> Switch to Professional
            </button>
          )}

          {currentUser.userType !== "homeowner" && (
            <button
              className={styles.avatar_menu_item}
              onClick={() => handleUserTypeSwitch("homeowner")}
            >
              <i className="fas fa-home"></i> Switch to Homeowner
            </button>
          )}

          <button 
            className={styles.avatar_menu_item} 
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </>
    );
  };

  const homeownerNav = () => {
    return (
      <>
        <header className={styles.header}>
          <div className={styles.container}>
            <Link to="/" className={styles.logo}>
              BuildKar
            </Link>
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
                  // value={searchQuery}
                  // onChange={(e) => setSearchQuery(e.target.value)}
                  // onKeyDown={fetchProfessionals}
                />
              </div>
            </div>

            <nav className={styles.nav}>
              <div className={styles.dropdown}>
                <button className={styles.dropbtn}>
                  Hire Professionals{" "}
                  <ChevronDownIcon
                    className={styles.chevronDownIcon}
                    color="#191919"
                    size={16}
                  />
                </button>
                <div className={styles.dropdownContent}>
                  <Link to="/professionals/architect">Architects</Link>
                  <Link to="/professionals/interior-designer">
                    Interior Designers
                  </Link>
                  <Link to="/professionals/electrician">Electricians</Link>
                  <Link to="/professionals/supplier">Material Suppliers</Link>
                  <Link to="/professionals/contractor">Contractors</Link>
                  <Link to="/professionals/painter">Painters</Link>
                </div>
              </div>

              <div className={styles.dropdown}>
                <button className={styles.dropbtn}>
                  Find Material{" "}
                  <ChevronDownIcon
                    className={styles.chevronDownIcon}
                    color="#191919"
                    size={16}
                  />
                </button>
                <div className={styles.dropdownContent}>
                  <Link to="/tiles">Tiles</Link>
                  <Link to="/flooring">Flooring</Link>
                  <Link to="/paint">Paint</Link>
                  <Link to="/lighting">Lighting</Link>
                  <Link to="/furniture">Furniture</Link>
                </div>
              </div>

              {currentUser && (
                <>
                  <Link to="/inbox" className={styles.navLink}>
                    Messages
                  </Link>
                  <Link to="/saved-items" className={styles.navLink}>
                    Saved Items
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
      </>
    );
  };

  const professionalNav = () => {
    return (
      <>
        <header className={styles.header}>
          <div className={styles.container}>
            <Link to="/" className={styles.logo}>
              BuildKar
            </Link>

            <nav className={styles.nav}>
              <>
                <Link to="/inbox" className={styles.navLink}>
                  Messages
                </Link>
                <Link to="/professional/jobs" className={styles.navLink}>
                  Jobs
                </Link>
                <Link to="/professional/analytics" className={styles.navLink}>
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
    return <></>;
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
      {globalUserType === "homeowner" && homeownerNav()}
      {globalUserType === "professional" && professionalNav()}
      {globalUserType === "supplier" && supplierNav()}
    </>
  );
};

export default Navigation;
