import React from 'react';
import styles from './HomepageMock4.module.css';

export default function HomepageMock4() {
  return (
    <div className={styles.storyScrollWrapper}>
      <section className={styles.heroSection}>
        <h1>Culture Continuity</h1>
        <p>Every journey is a story. Scroll to see how we help you stay connected and thrive.</p>
        <button className={styles.ctaBtn}>Get Started</button>
      </section>
      <section className={styles.section}>
        <h2>Why Culture Matters</h2>
        <p>Culture is your identity. We help you preserve it, wherever you go.</p>
      </section>
      <section className={styles.sectionAlt}>
        <h2>How We Help</h2>
        <p>Find communities, events, and resources tailored to your background and interests.</p>
      </section>
      <section className={styles.section}>
        <h2>Real Stories</h2>
        <p>Read how others have found belonging and built new connections.</p>
      </section>
      <section className={styles.ctaSection}>
        <button className={styles.ctaBtn}>Start Your Journey</button>
      </section>
    </div>
  );
}
