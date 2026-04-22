// CursorAurora.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';

const CursorAurora = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState([]);
  const [isMoving, setIsMoving] = useState(false);
  const requestRef = useRef();
  const lastTimeRef = useRef(0);
  
  // Aurora settings
  const trailLength = 25;
  const movementThreshold = 5;
  const particleSize = 20;
  const baseHue = 220; // Deep blue base color
  const lastPosition = useRef(position);

  const updatePosition = (e) => {
    const newPos = { x: e.clientX, y: e.clientY };
    setPosition(newPos);
    
    // Calculate movement speed
    const distance = Math.sqrt(
      Math.pow(newPos.x - lastPosition.current.x, 2) + 
      Math.pow(newPos.y - lastPosition.current.y, 2)
    );

    if (distance > movementThreshold) {
      if (!isMoving) setIsMoving(true);
      lastPosition.current = newPos;
    }
  };

  const animate = (time) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // Only update trail when moving
    if (isMoving) {
      setTrail(prev => {
        // Add slight randomness to create wavy effect
        const jitter = {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10
        };
        
        const newTrail = [{
          x: position.x + jitter.x,
          y: position.y + jitter.y,
          size: particleSize + Math.random() * 10,
          hue: (baseHue + (Math.random() * 40 - 20)) % 360
        }, ...prev];
        
        return newTrail.slice(0, trailLength);
      });
    } else if (trail.length > 0 && deltaTime > 50) {
      // Fade out trail when not moving
      setTrail(prev => prev.slice(0, Math.max(0, prev.length - 2)));
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    window.addEventListener('mousemove', updatePosition);
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isMoving, position]);

  // Reset movement state after delay
  useEffect(() => {
    if (!isMoving) return;
    const timer = setTimeout(() => setIsMoving(false), 200);
    return () => clearTimeout(timer);
  }, [isMoving, position]);

  return (
    <CursorContainer>
      {/* Main cursor - now with aurora core */}
      <CursorCore style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        background: `radial-gradient(circle, 
          hsl(${baseHue}, 100%, 80%) 0%, 
          hsl(${baseHue + 20}, 100%, 60%) 70%, 
          transparent 90%)`
      }} />
      
      {/* Aurora trail particles */}
      {trail.map((particle, index) => {
        const progress = index / trailLength;
        return (
          <AuroraParticle
            key={index}
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size * (1 - progress * 0.7)}px`,
              height: `${particle.size * (1 - progress * 0.7)}px`,
              opacity: 1 - progress * 0.9,
              background: `radial-gradient(circle, 
                hsla(${particle.hue}, 100%, 70%, 0.8) 0%, 
                hsla(${particle.hue + 30}, 100%, 50%, 0.3) 100%)`,
              filter: `blur(${8 - progress * 6}px)`,
              transform: `translate(-50%, -50%) scale(${1 + progress})`
            }}
          />
        );
      })}
    </CursorContainer>
  );
};

// Styled components
const CursorContainer = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: screen;
`;

const CursorCore = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  will-change: transform;
  filter: blur(1px);
`;

const AuroraParticle = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform, opacity, filter;
  transition: 
    opacity 0.3s ease-out,
    transform 0.4s cubic-bezier(0.2, 0.8, 0.4, 1);
`;

export default CursorAurora;