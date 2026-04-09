import React from 'react';
import styles from './HomepageMock3.module.css';

export default function HomepageMock3() {
  return (
    <div className={styles.mapHeroWrapper}>
      <div className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1>Discover Culture Everywhere</h1>
          <p>Explore a world of cultural resources, events, and communities. Click on the map to see what’s happening in your new city!</p>
          <button className={styles.ctaBtn}>Get Started</button>
        </div>
        <div className={styles.mapContainer}>
          {/* Replace with an interactive map or animated globe */}
          <img src="/mock-globe.svg" alt="Interactive Globe" className={styles.mapImg} />
        </div>
      </div>
      <div className={styles.testimonials}>
        <h2>Success Stories</h2>
        <div className={styles.carousel}>
          <div className={styles.storyCard}>
            <p>“I found my community and never felt alone in a new city!”</p>
            <span>- Priya, Student</span>
          </div>
          <div className={styles.storyCard}>
            <p>“The events helped me celebrate my culture and make new friends.”</p>
            <span>- Ahmed, Professional</span>
          </div>
        </div>
      </div>
    </div>
  );
}
