import styles from "./styles/footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Home Building Ecosystem</h3>
            <p>Connecting homeowners with trusted building professionals</p>
          </div>

          <div className={styles.section}>
            <h4>For Professionals</h4>
            <ul>
              <li>
                <a href="/join-as-professional">Join as Professional</a>
              </li>
              <li>
                <a href="/pricing">Pricing</a>
              </li>
              <li>
                <a href="/success-stories">Success Stories</a>
              </li>
              <li>
                <a href="/professional-resources">Resources</a>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>For Homeowners</h4>
            <ul>
              <li>
                <a href="/how-it-works">How It Works</a>
              </li>
              <li>
                <a href="/find-professionals">Find Professionals</a>
              </li>
              <li>
                <a href="/project-planning">Project Planning</a>
              </li>
              <li>
                <a href="/cost-calculator">Cost Calculator</a>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>Categories</h4>
            <ul>
              <li>
                <a href="/architects">Architects</a>
              </li>
              <li>
                <a href="/interior-designers">Interior Designers</a>
              </li>
              <li>
                <a href="/suppliers">Material Suppliers</a>
              </li>
              <li>
                <a href="/contractors">Contractors</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.social}>
            <a href="#">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
          <p>&copy; 2024 Home Building Ecosystem. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
