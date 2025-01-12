import { Link } from "react-router-dom";
import styles from "./styles/navigation.module.scss";
import { useAuth } from "../../contexts/authContext";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const avatarMenuRef = useRef(null);

  const toggleAvatarMenu = () => {
    setShowAvatarMenu(!showAvatarMenu);
  };

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

  const handleLogout = () => {
    logout();
  };

  return (
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

          {!currentUser && (
            <>
              <Link to="/login" className={styles.loginBtn}>
                Login
              </Link>
              <Link to="/register" className={styles.registerBtn}>
                Register
              </Link>
            </>
          )}

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
              {showAvatarMenu && (
                <div className={styles.avatar_menu}>
                  <Link
                    to={`/${
                      currentUser.userType === "homeowner"
                        ? "profile"
                        : currentUser.userType === "professional"
                        ? "professional-profile"
                        : "supplier-profile"
                    }/${currentUser.id}`}
                    className={styles.avatar_menu_item}
                  >
                    <i className="fas fa-user"></i> Profile
                  </Link>

                  <button
                    className={styles.avatar_menu_item}
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
