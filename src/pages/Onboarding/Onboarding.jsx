/* =========================================================
   Onboarding.jsx — Premium full-screen onboarding carousel
   Phase 2 — 3 animated slides teaching the ecosystem

   Slide 1: Contribute & Earn
   Slide 2: Unlock Request Cards
   Slide 3: Redeem With Partner Brands
   ========================================================= */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui';
import { ROUTES } from '../../utils/constants';

import { SlideContributeVisual, SlideRequestVisual, SlideRedeemVisual } from './SlideVisuals';
import FloatingParticles from '../Login/FloatingParticles';
import './Onboarding.css';

/* ─── Slide Data ──────────────────────────────────────────── */

const SLIDES = [
  {
    id: 'contribute',
    title: 'Contribute',
    titleGradient: '& Earn',
    description: 'Make small contributions and earn credits that unlock access to requests.',
    Visual: SlideContributeVisual,
  },
  {
    id: 'request',
    title: 'Unlock',
    titleGradient: 'Request Cards',
    description: 'Use your Earn Credits to unlock request tiers and launch your own request.',
    Visual: SlideRequestVisual,
  },
  {
    id: 'redeem',
    title: 'Redeem With',
    titleGradient: 'Partner Brands',
    description: 'Watch Buy Credits grow and redeem them with partner brands.',
    Visual: SlideRedeemVisual,
  },
];

/* ─── Animation Variants ──────────────────────────────────── */

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.35 },
      scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.92,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.3 },
    },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Onboarding Component ────────────────────────────────── */

export default function Onboarding() {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [[activeSlide, direction], setSlide] = useState([0, 0]);
  const [isCompleting, setIsCompleting] = useState(false);

  // If onboarding already completed, skip to KYC/dashboard
  useEffect(() => {
    if (user?.onboardingComplete) {
      navigate(ROUTES.KYC, { replace: true });
    }
  }, [user?.onboardingComplete, navigate]);

  const totalSlides = SLIDES.length;
  const isFirst = activeSlide === 0;
  const isLast = activeSlide === totalSlides - 1;

  /* ─── Navigation Handlers ───────────────────────────────── */

  const goNext = useCallback(() => {
    if (activeSlide < totalSlides - 1) {
      setSlide([activeSlide + 1, 1]);
    }
  }, [activeSlide, totalSlides]);

  const goPrev = useCallback(() => {
    if (activeSlide > 0) {
      setSlide([activeSlide - 1, -1]);
    }
  }, [activeSlide]);

  const goToSlide = useCallback((index) => {
    setSlide([index, index > activeSlide ? 1 : -1]);
  }, [activeSlide]);

  /* ─── Completion Handler ────────────────────────────────── */

  const handleComplete = useCallback(() => {
    setIsCompleting(true);
    completeOnboarding();

    // Small delay for the completion animation
    setTimeout(() => {
      navigate(ROUTES.KYC, { replace: true });
    }, 600);
  }, [completeOnboarding, navigate]);

  /* ─── Skip Handler ──────────────────────────────────────── */

  const handleSkip = useCallback(() => {
    completeOnboarding();
    navigate(ROUTES.KYC, { replace: true });
  }, [completeOnboarding, navigate]);

  /* ─── Keyboard Navigation ───────────────────────────────── */

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowRight' && !isLast) goNext();
      if (e.key === 'ArrowLeft' && !isFirst) goPrev();
      if (e.key === 'Enter' && isLast) handleComplete();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFirst, isLast, goNext, goPrev, handleComplete]);

  /* ─── Current slide data ────────────────────────────────── */

  const currentSlide = SLIDES[activeSlide];

  /* ─── Render ─────────────────────────────────────────────── */

  return (
    <motion.div
      className="onboarding"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated mesh background */}
      <div className="onboarding__bg" />

      {/* Floating particles (reuse from Login) */}
      <FloatingParticles count={20} />

      {/* Skip button */}
      <motion.button
        className="onboarding__skip"
        id="onboarding-skip"
        onClick={handleSkip}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        aria-label="Skip onboarding"
      >
        Skip
      </motion.button>

      {/* ── Main Slide Container ── */}
      <div className="onboarding__slide-container">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide.id}
            className="onboarding-slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Visual */}
            <div className="onboarding-slide__visual">
              <currentSlide.Visual key={currentSlide.id} />
            </div>

            {/* Title */}
            <motion.h1
              className="onboarding-slide__title"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
            >
              {currentSlide.title}{' '}
              <span className="onboarding-slide__title-gradient">
                {currentSlide.titleGradient}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="onboarding-slide__description"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
            >
              {currentSlide.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Progress Dots ── */}
      <motion.div
        className="onboarding__dots"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        role="tablist"
        aria-label="Onboarding progress"
      >
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            className={`onboarding__dot ${index === activeSlide ? 'onboarding__dot--active' : ''}`}
            id={`onboarding-dot-${index}`}
            onClick={() => goToSlide(index)}
            role="tab"
            aria-selected={index === activeSlide}
            aria-label={`Go to slide ${index + 1}: ${slide.title} ${slide.titleGradient}`}
          />
        ))}
      </motion.div>

      {/* ── Navigation Buttons ── */}
      <motion.nav
        className="onboarding__nav"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        aria-label="Onboarding navigation"
      >
        {/* Previous Button */}
        <AnimatePresence>
          {!isFirst && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Button
                variant="secondary"
                size="lg"
                icon={ChevronLeft}
                id="onboarding-prev"
                onClick={goPrev}
                aria-label="Previous slide"
              >
                Back
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next / Get Started Button */}
        {isLast ? (
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            id="onboarding-complete"
            onClick={handleComplete}
            loading={isCompleting}
            className="onboarding__cta-final"
          >
            Get Started
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            icon={ChevronRight}
            iconPosition="right"
            id="onboarding-next"
            onClick={goNext}
          >
            Next
          </Button>
        )}
      </motion.nav>
    </motion.div>
  );
}
