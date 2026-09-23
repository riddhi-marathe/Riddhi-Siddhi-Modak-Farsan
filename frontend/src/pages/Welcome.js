import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const VIDEO_DURATION = 8; // seconds before auto-redirect (video length)

const Welcome = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [showContent, setShowContent] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  // Show content after a short delay (for the video to start)
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Show skip button after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Progress bar and auto-redirect
  useEffect(() => {
    if (videoEnded) {
      const redirectTimer = setTimeout(() => navigate('/home'), 1500);
      return () => clearTimeout(redirectTimer);
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (VIDEO_DURATION * 10));
        if (newProgress >= 100) {
          clearInterval(interval);
          setVideoEnded(true);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [videoEnded, navigate]);

  const handleSkip = () => {
    navigate('/home');
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  return (
    <div className="welcome-page">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="welcome-video-bg"
        onEnded={handleVideoEnd}
        onError={() => setVideoEnded(true)} // Auto-redirect if video fails
      >
        <source src="/assets/intro-video.mp4" type="video/mp4" />
      </video>

      {/* Light brand wash keeps the food imagery visible while preserving readable type. */}
      <div className="welcome-overlay"></div>

      {/* Progress Bar */}
      <div 
        className="welcome-progress" 
        style={{ width: `${progress}%` }}
      ></div>

      {/* Content */}
      <AnimatePresence>
        {showContent && !videoEnded && (
          <div className="welcome-content">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="welcome-logo-wrap"
            >
              <img src="/assets/logo-image.jpeg" alt="Riddhi Siddhi Modak Farsan logo" className="welcome-logo" />
            </motion.div>
            <motion.h1
              key="title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="welcome-title"
            >
              Riddhi Siddhi
              <br />
              Modak & Farsan
            </motion.h1>

            <motion.p
              key="tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="welcome-tagline"
            >
              Shuddh Swad, Hamari Pehchaan
            </motion.p>

            <motion.button
              key="btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSkip}
              className="welcome-btn"
            >
              Explore the fresh menu <span aria-hidden="true">↗</span>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Redirecting / Video Ended State */}
      <AnimatePresence>
        {videoEnded && (
          <motion.div
            key="redirecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="welcome-content"
          >
            <img src="/assets/logo-image.jpeg" alt="Riddhi Siddhi Modak Farsan logo" className="welcome-logo welcome-logo-small" />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="welcome-title"
              style={{ fontSize: '2rem' }}
            >
              Welcome to Riddhi Siddhi!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="welcome-tagline"
              style={{ fontSize: '1.1rem', color: '#A6422B' }}
            >
              Taking you to our delicious menu...
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="welcome-spinner"
            ></motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Button */}
      {showSkip && !videoEnded && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="welcome-skip-btn"
          onClick={handleSkip}
        >
          Skip ▶
        </motion.button>
      )}

      {/* Brand Footer */}
      <div className="welcome-brand">
        <p>Riddhi Siddhi Modak Farsan</p>
      </div>
    </div>
  );
};

export default Welcome;
