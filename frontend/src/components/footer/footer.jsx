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
                <a href="/analytics">Set up your portfolio</a>
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
                <a href="/hire-professionals">Hire People</a>
              </li>
              <li>
                <a href="/find-materials">Find Materials</a>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>For Suppliers</h4>
            <ul>
              <li>
                <a href="/advertise-materials">Advertise materials</a>
              </li>
              <li>
                <a href="/find-buyers">Find buyers</a>
              </li>
              <li>
                <a href="/selling-guide">Selling Guide</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2024 Home Building Ecosystem. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
