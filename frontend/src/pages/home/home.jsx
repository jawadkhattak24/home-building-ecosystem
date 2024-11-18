import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles/home.module.scss";
import Navigation from "../../components/navigation/navigation";
import Footer from "../../components/footer/footer";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    "/images/avi-werde.jpg",
    "/images/stephan-bechert.jpg",
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <>
      <Navigation />

      <div className={styles.container}>
        <section id="services" className={styles.section}>
          <h2>Our Services</h2>

          <div className={styles.row}>
            <div className={styles.col}>
              <img src="/images/daniel-mccullough.jpg" alt="" />
            </div>
            <div className={styles.col}>
              <h3>Planning</h3>
              <p>
                Planning phase of the Home Building Ecosystem project includes
                defining a clear project structure and setting up the groundwork
                for development...
              </p>
            </div>
          </div>

          <div className={`${styles.row} ${styles.reverseRow}`}>
            <div className={styles.col}>
              <img src="/images/annie-gray.jpg" alt="" />
            </div>
            <div className={styles.col}>
              <h3>Customizing</h3>
              <p>
                The Home Building Ecosystem is a digital platform designed to
                simplify the home construction process...
              </p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.col}>
              <img src="/images/greyson-joralemon.jpg" alt="" />
            </div>
            <div className={styles.col}>
              <h3>Building</h3>
              <p>
                The Home Building Ecosystem is developed as a responsive and
                modular platform...
              </p>
            </div>
          </div>

          <div className={styles.centerButton}>
            <button className={styles.button}>Learn More</button>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Past Projects</h2>
          <div className={styles.carousel}>
            <img
              src={carouselImages[currentSlide]}
              alt=""
              onClick={nextSlide}
            />
          </div>
          <div className={styles.centerButton}>
            <button className={styles.button}>Learn More</button>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Company News</h2>
          <div className={styles.row}>
            <div className={styles.col}>
              <img src="/images/cytonn-photography.jpg" alt="" />
              <h3>
                Home Building Ecosystem announces new partnership with Building
                Co.
              </h3>
            </div>
            <div className={styles.col}>
              <img src="/images/scott-graham.jpg" alt="" />
              <h3>Book A Phone Consultation Today!</h3>
            </div>
            <div className={styles.col}>
              <img src="/images/20off.png" alt="" />
              <h3>20% discount when you refer our services!</h3>
            </div>
          </div>
          <div className={styles.centerButton}>
            <button className={styles.button}>Learn More</button>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Blog and Resources</h2>
          <div className={styles.row}>
            <div className={styles.col}>
              <img src="/images/lucian-novosel.jpg" alt="" />
              <h3>
                What to know about your personal projects and renovation finance
              </h3>
            </div>
            <div className={styles.col}>
              <img src="/images/avinash-kumar.jpg" alt="" />
              <h3>What to look for signs of mold in your home</h3>
            </div>
            <div className={styles.col}>
              <img src="/images/kelly-sikkema.jpg" alt="" />
              <h3>How to set a reasonable budget for home rennovation</h3>
            </div>
          </div>
          <div className={styles.centerButton}>
            <Link to="/blog">
              <button className={styles.button}>Learn More</button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
