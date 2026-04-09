/**
 * Main Page Component
 * Handles the UI flow between input form and results display
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InputForm } from '@/components/InputForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import HomepageMock1 from '@/components/HomepageMock1';
import styles from '@/components/Homepage.module.css';
import homeStyles from '@/components/HomepageMock1.module.css';
import PostFormChoice from '@/components/PostFormChoice';
import Modal from '@/components/Modal';
import {
  UserProfile,
  ResourceSearchResult,
  SuggestedRoutine,
  ApiError,
  CulturalLandscapeAnalysis,
} from '@/lib/types';

type PageState = 'homepage' | 'input' | 'loading' | 'results' | 'error';

export default function Home() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>('homepage');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showFillFormModal, setShowFillFormModal] = useState(false);
  const [results, setResults] = useState<ResourceSearchResult | null>(null);
  const [suggestedRoutines, setSuggestedRoutines] = useState<SuggestedRoutine[]>([]);
  const [culturalAnalysis, setCulturalAnalysis] = useState<CulturalLandscapeAnalysis | null>(null);
  const [mainSection, setMainSection] = useState<'preserve' | 'explore' | null>(null);
  const [error, setError] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);

  // Handler for form submission
  const handleFormSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowChoiceModal(true);
    setJustSubmitted(true);
  };

  // Handler for post-form choice
  const handleChoice = async (choice: 'preserve' | 'explore') => {
    setMainSection(choice);
    setShowChoiceModal(false);
    setPageState('loading');
    if (!userProfile) return;
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch resources');
      }

      const data = await response.json();
      setResults(data.data);
      setSuggestedRoutines(data.suggestedRoutines || []);
      setCulturalAnalysis(data.culturalAnalysis || null);
      setPageState('results');
      setError('');
      setJustSubmitted(true); // Only show toggle after direct form submission
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPageState('error');
      console.error('Error fetching resources:', err);
    }
  };

  // Handler for going back to form
  const handleBackToForm = () => {
    setPageState('input');
    setResults(null);
    setSuggestedRoutines([]);
    setCulturalAnalysis(null);
    setError('');
    setUserProfile(null);
    setMainSection(null);
    setJustSubmitted(false);
  };

  const goToForm = () => {
    setPageState('input');
    router.push('/');
  };

  const handleHomepageSection = async (section: 'preserve' | 'explore') => {
    if (!userProfile) {
      setShowFillFormModal(true);
      return;
    }

    if (results) {
      setPageState('results');
      setMainSection(section);
      setJustSubmitted(false);
      return;
    }

    await handleChoice(section);
  };

  // Listen for nav-action events from NavBar
  useEffect(() => {
    function handleNavAction(e: any) {
      const section = e.detail?.section;
      if (section === 'preserve') {
        if (userProfile) {
          setPageState('results');
          setMainSection('preserve');
          setJustSubmitted(false); // No toggle
        } else {
          setShowFillFormModal(true);
        }
      } else if (section === 'explore') {
        if (userProfile) {
          setPageState('results');
          setMainSection('explore');
          setJustSubmitted(false); // No toggle
        } else {
          setShowFillFormModal(true);
        }
      } else if (section === 'home') {
        // Home goes to explore tab by default
        if (userProfile) {
          setPageState('results');
          setMainSection('explore');
          setJustSubmitted(false); // No toggle
        } else {
          setShowFillFormModal(true);
        }
      }
    }
    window.addEventListener('nav-action', handleNavAction);
    return () => window.removeEventListener('nav-action', handleNavAction);
  }, [userProfile]);

  const themedPageShell = {
    minHeight: 'calc(100vh - 88px)',
    padding: '2rem 1.25rem 3rem',
    background: 'linear-gradient(180deg, #faf4e8 0%, #f4ebd9 100%)',
  } as const;

  return (
    <>
      <nav className={homeStyles.homepageHeader}>
        <div className={homeStyles.containerHeader}>
          <button
            className={homeStyles.siteTitle}
            onClick={() => {
              setPageState('homepage');
              router.push('/');
            }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Culture Continuity
          </button>
          <div className={homeStyles.tabs}>
            <button
              className={`${homeStyles.tab} ${pageState === 'input' ? homeStyles.tabActive : ''}`}
              onClick={goToForm}
            >
              Enter Details
            </button>
            <button
              className={`${homeStyles.tab} ${(pageState === 'results' && mainSection === 'preserve') ? homeStyles.tabActive : ''}`}
              onClick={() => void handleHomepageSection('preserve')}
            >
              Preserve My Culture
            </button>
            <button
              className={`${homeStyles.tab} ${(pageState === 'results' && mainSection === 'explore') ? homeStyles.tabActive : ''}`}
              onClick={() => void handleHomepageSection('explore')}
            >
              Explore Local Cultures
            </button>
          </div>
        </div>
      </nav>

      {pageState === 'homepage' && (
        <HomepageMock1
          onGetStarted={goToForm}
          onEnterDetails={goToForm}
          onPreserveCulture={() => void handleHomepageSection('preserve')}
          onExploreCultures={() => void handleHomepageSection('explore')}
        />
      )}
      {pageState === 'input' && (
        <div style={themedPageShell}>
          <div style={{ maxWidth: 980, margin: '0 auto' }}>
            <div
              style={{
                background: '#fff8ea',
                border: '1px solid #e2cfa6',
                borderRadius: 14,
                padding: '1rem 1.1rem',
                marginBottom: '0.9rem',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 28,
                  lineHeight: 1.2,
                  color: '#2f271d',
                  fontWeight: 800,
                }}
              >
                Tell us about your background
              </h2>
              <p
                style={{
                  margin: '0.5rem 0 0',
                  color: '#5f4f3a',
                  fontSize: 16,
                  lineHeight: 1.55,
                }}
              >
                Fill in this form so we can understand your cultural background and destination.
                We use this to show relevant communities, spaces, and events that actually match you.
              </p>
            </div>
            <InputForm onSubmit={handleFormSubmit} submitLabel="Continue" isLoading={false} />
          </div>
        </div>
      )}
      <Modal open={showChoiceModal} onClose={() => setShowChoiceModal(false)}>
        <PostFormChoice
          onSelect={handleChoice}
        />
      </Modal>
      <Modal open={showFillFormModal} onClose={() => setShowFillFormModal(false)}>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <h2 style={{ fontWeight: 700, fontSize: 22, color: '#1e293b', marginBottom: 8 }}>Please fill the form first</h2>
          <p style={{ color: '#334155', marginBottom: 18 }}>
              To access <b>Preserve My Culture</b> or <b>Explore Local Cultures</b>, please enter your details first.
          </p>
          <button
            onClick={() => { setShowFillFormModal(false); goToForm(); }}
            style={{
              marginTop: 12,
              padding: '0.75rem 2.5rem',
              background: '#8f651d',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 18,
              boxShadow: '0 2px 12px rgba(143, 101, 29, 0.22)',
              cursor: 'pointer',
              transition: 'background 0.2s',
              outline: 'none',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#a47623')}
            onMouseOut={e => (e.currentTarget.style.background = '#8f651d')}
          >
            Go to Form
          </button>
        </div>
      </Modal>
      {pageState === 'results' && results && (
        <div style={themedPageShell}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <ResultsDisplay
              results={results}
              suggestedRoutines={suggestedRoutines}
              culturalAnalysis={culturalAnalysis}
              mainSection={mainSection ?? undefined}
              showToggle={justSubmitted}
              onBack={handleBackToForm}
            />
          </div>
        </div>
      )}
      {pageState === 'loading' && (
        <div style={themedPageShell}>
          <div className={styles.loading}>Loading...</div>
        </div>
      )}
      {error && (
        <div style={themedPageShell}>
          <div className={styles.error}>{error}</div>
        </div>
      )}
    </>
  );
}
