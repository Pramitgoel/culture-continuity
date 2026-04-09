import React from 'react';
import styles from './Homepage.module.css';

interface HomepageProps {
  onGetStarted: () => void;
}

export default function HomepageExperiment({ onGetStarted }: HomepageProps) {
  return (
    <div>
      <div className={styles['hero-section']}>
        <div className={styles['hero-content']}>
          <div className={styles['hero-title']}>Rooted</div>
          <div className={styles['hero-subtitle']}>
            Stepping into a new city or starting university?<br/>
            Moving to a new place doesn’t mean leaving your culture behind. Stay connected to your roots while exploring and engaging with the cultures around you.
          </div>
          <div className={styles['hero-benefits']}>
            <div className={styles['benefit-card']}>
              <div className={styles['benefit-icon']}>🛡️</div>
              <div className={styles['benefit-title']}>Preserve Your Culture</div>
              <div className={styles['benefit-desc']}>Find communities, events, and resources to stay connected to your roots.</div>
            </div>
            <div className={styles['benefit-card']}>
              <div className={styles['benefit-icon']}>🌏</div>
              <div className={styles['benefit-title']}>Explore Local Cultures</div>
              <div className={styles['benefit-desc']}>Learn about your new environment, compare values, and integrate smoothly.</div>
            </div>
            <div className={styles['benefit-card']}>
              <div className={styles['benefit-icon']}>🤝</div>
              <div className={styles['benefit-title']}>Build Connections</div>
              <div className={styles['benefit-desc']}>Meet people, join groups, and participate in cross-cultural activities.</div>
            </div>
          </div>
          <div className={styles['hero-actions']}>
            <button className={styles['hero-btn']} onClick={onGetStarted}>Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
}
