import { Link } from "react-router-dom";
import styles from "./styles/navigation.module.scss";
import { useAuth } from "../../contexts/authContext";
import { useState, useRef, useEffect } from "react";

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
          Home Building Ecosystem
        </Link>
        <nav className={styles.nav}>
          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Find Professionals</button>
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

          <Link to="/materials" className={styles.navLink}>
            Materials
          </Link>
          <Link to="/inbox" className={styles.navLink}>
            Messages
          </Link>
          <Link to="/saved-items" className={styles.navLink}>
            Saved Items
          </Link>

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
