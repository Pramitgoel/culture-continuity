import React from 'react';
import styles from './HomepageMock5.module.css';

export default function HomepageMock5() {
  return (
    <div className={styles.cardGridWrapper}>
      <section className={styles.heroSection}>
        <h1>Find Your Community</h1>
        <p>Browse resources, events, and groups to help you feel at home in any city.</p>
        <button className={styles.ctaBtn}>Get Started</button>
      </section>
      <section className={styles.cardGrid}>
        <div className={styles.card}>
          <h3>Indian Cultural Society</h3>
          <p>Weekly meetups, festivals, and food events for Indian students and families.</p>
        </div>
        <div className={styles.card}>
          <h3>International Food Festival</h3>
          <p>Sample cuisines from around the world and meet new friends.</p>
        </div>
        <div className={styles.card}>
          <h3>Language Exchange</h3>
          <p>Practice new languages and share your own with others.</p>
        </div>
        <div className={styles.card}>
          <h3>Faith & Worship Spaces</h3>
          <p>Find places of worship and spiritual support in your area.</p>
        </div>
      </section>
    </div>
  );
}
