"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Homepage.module.css';

export default function NavBar() {
  const router = useRouter();

  // These will trigger navigation or reload the main page with the correct state
  const goHome = () => router.push('/');
  const goForm = () => {
    // Use a query param to trigger form view
    router.push('/?form=1');
    // Optionally, you can use a custom event or state if you want to avoid reload
  };
  // Custom navigation for preserve/explore to allow blocking if form not filled
  const goPreserve = () => {
    window.dispatchEvent(new CustomEvent('nav-action', { detail: { section: 'preserve' } }));
  };
  const goExplore = () => {
    window.dispatchEvent(new CustomEvent('nav-action', { detail: { section: 'explore' } }));
  };

  return (
    <nav className={styles['homepage-header']} style={{ position: 'sticky', top: 0, zIndex: 40 }}>
      <div className={styles['header-content']}>
        <div className={styles['site-title']} style={{ cursor: 'pointer' }} onClick={goHome}>Rooted</div>
        <div className={styles['tabs']}>
          <button className={styles['tab']} onClick={goForm}>📝 Enter Details</button>
          <button className={styles['tab']} onClick={goPreserve}>🛡️ Preserve My Culture</button>
          <button className={styles['tab']} onClick={goExplore}>🌏 Explore Local Cultures</button>
        </div>
      </div>
    </nav>
  );
}
