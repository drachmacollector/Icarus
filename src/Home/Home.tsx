// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
  const [showIndicator, setShowIndicator] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowIndicator(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const video = document.getElementById('bgVideo');
    if (video) {
      const handleLoadedMetadata = () => {
        video.currentTime = video.duration / 4;
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  return (
    <div className="home-container">
      <video id="bgVideo" autoPlay loop muted className="bg-video">
        <source src="/earth2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="overlay-content">
        <h1>Icarus</h1>
        <p>Mapping solar fury & auroral beauty across the Earth's skies</p>
      </div>

      {showIndicator && (
        <div className="sd-container">
          <div className="arrow"></div>
          <div className="arrow"></div>
        </div>
      )}

    </div>
  );
};

export default Home;
