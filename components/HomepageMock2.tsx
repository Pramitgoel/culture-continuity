import React from 'react';
import styles from './HomepageMock2.module.css';

export default function HomepageMock2() {
  return (
    <div className={styles.splitWrapper}>
      <div className={styles.leftPane}>
        <h1>Welcome to Rooted</h1>
        <p>Start your journey in a new city or university with confidence. Stay rooted in your culture while exploring new ones.</p>
        <button className={styles.ctaBtn}>Get Started</button>
      </div>
      <div className={styles.rightPane}>
        {/* Replace with a real image or SVG */}
        <img src="/mock-city-illustration.svg" alt="City Illustration" className={styles.illustration} />
      </div>
      <div className={styles.howItWorks}>
        <h2>How it works</h2>
        <ol>
          <li>Enter your details</li>
          <li>Discover resources and communities</li>
          <li>Connect and thrive</li>
        </ol>
      </div>
    </div>
  );
}
