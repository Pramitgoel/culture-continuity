import React from 'react';
import styles from './HomepageMock1.module.css';

interface HomepageMock1Props {
  onGetStarted?: () => void;
  onEnterDetails?: () => void;
  onPreserveCulture?: () => void;
  onExploreCultures?: () => void;
}

export default function HomepageMock1({
  onGetStarted,
  onEnterDetails: _onEnterDetails,
  onPreserveCulture: _onPreserveCulture,
  onExploreCultures: _onExploreCultures,
}: HomepageMock1Props) {
  return (
    <div className={styles.page}>
      <main className={styles.containerMain}>
        <section className={styles.heroGrid} aria-label="Hero section">
          <article className={styles.heroCopy}>
            <span className={styles.eyebrow}>Belong Anywhere</span>
            <h2 className={styles.heroHeading}>
              Stay rooted in your culture,
              <span className={styles.highlight}> grow in a new one.</span>
            </h2>
            <p className={styles.lead}>
              Moving to a new city or starting college somewhere unfamiliar can feel isolating. Rooted helps you preserve your identity, discover nearby communities, and build meaningful cross-cultural connections.
            </p>
            <div className={styles.heroActions}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onGetStarted}>Get Started</button>
            </div>
          </article>

          <aside className={styles.heroCard} aria-label="Why choose Rooted">
            <h3 className={styles.sideTitle}>Why Rooted?</h3>
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <strong>Preserve Your Culture</strong>
                <span>Find communities, events, and resources that keep you connected to your roots.</span>
              </li>
              <li className={styles.featureItem}>
                <strong>Explore Local Cultures</strong>
                <span>Learn about your new environment and adapt with confidence and clarity.</span>
              </li>
              <li className={styles.featureItem}>
                <strong>Build Real Connections</strong>
                <span>Meet people, join groups, and create lasting friendships across cultures.</span>
              </li>
            </ul>
          </aside>
        </section>

        <section className={styles.impact} aria-label="Impact">
          <div className={styles.impactHead}>
            <h3 className={styles.impactTitle}>Our Impact</h3>
          </div>
          <div className={styles.impactGrid}>
            <div className={styles.impactStat}><span className={styles.impactNumber}>400+</span><span className={styles.impactLabel}>Users Helped</span></div>
            <div className={styles.impactStat}><span className={styles.impactNumber}>150+</span><span className={styles.impactLabel}>Cities Covered</span></div>
            <div className={styles.impactStat}><span className={styles.impactNumber}>1000+</span><span className={styles.impactLabel}>Resources Identified</span></div>
            <div className={styles.impactStat}><span className={styles.impactNumber}>86%</span><span className={styles.impactLabel}>Positive Feedback</span></div>
            <div className={styles.impactStat}><span className={styles.impactNumber}>50+</span><span className={styles.impactLabel}>Cultural Backgrounds</span></div>
          </div>
        </section>
      </main>
    </div>
  );
}
