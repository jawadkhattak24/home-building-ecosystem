import { Link } from "react-router-dom";
import styles from "./styles/navigation.module.scss";

const Navigation = () => {
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
              <Link to="/professionals/architects">Architects</Link>
              <Link to="/professionals/interior-designers">
                Interior Designers
              </Link>
              <Link to="/professionals/modelers">3D Modelers</Link>
              <Link to="/professionals/suppliers">Material Suppliers</Link>
              <Link to="/professionals/contractors">Contractors</Link>
              <Link to="/professionals/painters">Painters</Link>
            </div>
          </div>
          <Link to="/projects" className={styles.navLink}>
            Browse Projects
          </Link>
          <Link to="/materials" className={styles.navLink}>
            Materials
          </Link>
          {/* <Link to="/join-as-professional" className={styles.proBtn}>
            Join as Professional
          </Link> */}
          <Link to="/login" className={styles.loginBtn}>
            Login
          </Link>
          <Link to="/register" className={styles.registerBtn}>
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
