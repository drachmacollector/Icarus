import React, { useEffect, useState } from "react";
import AOS from "aos";
import CursorAurora from "./CursorAurora";
import styled from "@emotion/styled";
import {
  FaNewspaper,
  FaSun,
  FaGlobe,
  FaFireAlt,
  FaMagic,
  FaStream,
  FaArrowUp,
  FaCheckCircle,
  FaRocket,
  FaLightbulb,
  FaUsers,
  FaChevronDown
} from "react-icons/fa";

const features = [
  {
    icon: <FaNewspaper />,
    title: "Space News Feed",
    description: "Curated headlines and updates from NASA, ESA, and trusted sources.",
    api: "NASA Breaking News RSS Feed, ESA Space News Feed"
  },
  {
    icon: <FaFireAlt />,
    title: "Solar Flare Tracker",
    description: "Real-time flare detection with mapped locations on a 3D globe.",
    api: "NASA DONKI API - Solar Flares"
  },
  {
    icon: <FaSun />,
    title: "CME Visualizer",
    description: "Animated trajectory and risk estimation of Coronal Mass Ejections.",
    api: "NASA DONKI API - CME Endpoint"
  },
  {
    icon: <FaMagic />,
    title: "Aurora Forecast",
    description: "Dynamic aurora ring animations based on NOAA Kp Index.",
    api: "NOAA SWPC Kp Index API"
  },
  {
    icon: <FaGlobe />,
    title: "Global Heatmap",
    description: "Visual heatmaps of radiation and geomagnetic disturbances.",
    api: "NOAA Real-Time Geomagnetic Data"
  },
  {
    icon: <FaStream />,
    title: "Interactive Timeline",
    description: "Scroll through solar activity history and predictions.",
    api: "NASA DONKI API, Custom Time Series Data"
  }
];

const scientificTerms = [
  {
    term: "Solar Flare",
    definition: "A sudden burst of radiation from the sun, often linked with sunspots. Can disrupt radio communications.",
    link: "https://solarscience.msfc.nasa.gov/flares.shtml"
  },
  {
    term: "CME (Coronal Mass Ejection)",
    definition: "Huge plasma explosions from the sun's corona. Can hit Earth's magnetic field and cause geomagnetic storms.",
    link: "https://www.swpc.noaa.gov/phenomena/coronal-mass-ejections"
  },
  {
    term: "Kp Index",
    definition: "A planetary index measuring geomagnetic activity on a scale from 0 (calm) to 9 (extreme).",
    link: "https://www.swpc.noaa.gov/products/planetary-k-index"
  },
  {
    term: "Aurora",
    definition: "Colorful light displays in the sky caused by charged solar particles interacting with Earth's magnetic field.",
    link: "https://www.swpc.noaa.gov/phenomena/aurora"
  },
  {
    term: "Geomagnetic Storm",
    definition: "A disturbance in Earth's magnetosphere caused by solar wind and CMEs. Can affect GPS, power grids, and satellites.",
    link: "https://www.swpc.noaa.gov/phenomena/geomagnetic-storms"
  },
  {
    term: "DONKI API",
    definition: "NASA's 'Database Of Notifications, Knowledge, Information' for space weather events.",
    link: "https://kauai.ccmc.gsfc.nasa.gov/DONKI/"
  }
];

const uniquePoints = [
  {
    icon: <FaRocket />,
    title: "3D Globe Visualizations",
    desc: "Live animations of flares, CMEs, and auroras mapped on a rotating Earth."
  },
  {
    icon: <FaCheckCircle />,
    title: "All-in-One Dashboard",
    desc: "Solar Flares, CMEs, Auroras, Risk Zones, Timeline & News – unified."
  },
  {
    icon: <FaLightbulb />,
    title: "Educational & Scientific",
    desc: "Explains terms like Kp Index, Geomagnetic Storms, CMEs clearly."
  },
  {
    icon: <FaUsers />,
    title: "For Everyone",
    desc: "Pilots, students, space lovers, disaster planners – all benefit."
  }
];

const AboutPage = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <CursorWrapper>
      <CursorAurora />
      
      <div className="about-container">
        <section className="hero">
          <h1>Icarus</h1>
          <p>A next-gen space weather platform visualizing solar events in real time.</p>
          <div className="scroll-down-arrow" data-aos="fade-down">
            <FaChevronDown className="chevron bounce" />
          </div>
        </section>
        <section className="impact-section" data-aos="fade-up">
  <h2>🌍 What Our App Helps With</h2>
  <p>
    The <strong>Radio Blackout Dashboard</strong> is a next-gen platform for real-time space weather visualization. It collects, interprets, and displays data from authoritative sources like <a href="https://www.nasa.gov" target="_blank" rel="noopener noreferrer">NASA</a>, <a href="https://www.swpc.noaa.gov" target="_blank" rel="noopener noreferrer">NOAA</a>, and <a href="https://www.esa.int" target="_blank" rel="noopener noreferrer">ESA</a>. Our system brings you detailed insights on phenomena such as:
  </p>
  <ul>
    <li>
      <strong>🔭 Solar Flares:</strong> High-energy bursts from the sun that can impact satellite communications and GPS. 
      <a href="https://solarscience.msfc.nasa.gov/flares.shtml" target="_blank" rel="noopener noreferrer">Learn more ↗</a>
    </li>
    <li>
      <strong>☀️ Coronal Mass Ejections (CMEs):</strong> Expulsions of plasma that can trigger geomagnetic storms on Earth. 
      <a href="https://www.swpc.noaa.gov/phenomena/coronal-mass-ejections" target="_blank" rel="noopener noreferrer">Explore CME science ↗</a>
    </li>
    <li>
      <strong>🌌 Auroras:</strong> Beautiful atmospheric lights that indicate geomagnetic activity from solar particles. 
      <a href="https://www.swpc.noaa.gov/phenomena/aurora" target="_blank" rel="noopener noreferrer">Aurora basics ↗</a>
    </li>
    <li>
      <strong>🧭 Kp Index & Radiation Maps:</strong> Tools to assess geomagnetic storm levels and Earth’s magnetic stability. 
      <a href="https://www.swpc.noaa.gov/products/planetary-k-index" target="_blank" rel="noopener noreferrer">Kp Index explained ↗</a>
    </li>
  </ul>
  <p>
    Our dashboard transforms complex datasets into intuitive 3D visuals, charts, and animations — helping users detect, analyze, and prepare for real-time solar threats.
  </p>
</section>

<section className="significance-section" data-aos="fade-up">
  <h2>🚨 Why This Matters</h2>
  <p>
    Space weather is no longer just for astronauts or scientists — it affects your daily life more than you think. Here’s why our app is important:
  </p>
  <ul>
    <li>
      <strong>⚡ Protecting Technology:</strong> Solar storms can disrupt <a href="https://www.nasa.gov/mission_pages/sunearth/spaceweather/index.html" target="_blank" rel="noopener noreferrer">power grids, satellites, and aircraft</a>. Forecasts can prevent billions in damage.
    </li>
    <li>
      <strong>📡 Real-Time Awareness:</strong> Access live alerts from NASA and NOAA. Act swiftly when a high-risk flare or CME is approaching.
    </li>
    <li>
      <strong>🛰️ Supporting Aviation & Satellites:</strong> Airlines and satellite operators use space weather tools to avoid outages or reroute paths.
    </li>
    <li>
      <strong>🌐 Education and Outreach:</strong> Teachers, students, and hobbyists gain a stunning, interactive way to learn about heliophysics and Earth-Sun interactions.
    </li>
    <li>
      <strong>👩‍🚀 Citizen Science Ready:</strong> Built with accessibility and openness — perfect for integrating into <a href="https://aurorasaurus.org/" target="_blank" rel="noopener noreferrer">citizen-driven space monitoring</a>.
    </li>
  </ul>
</section>

        <section className="unique-section" data-aos="fade-up">
          <h2>🎯 What Makes Us Unique</h2>
          <div className="unique-grid">
            {uniquePoints.map((item, index) => (
              <div className="unique-item" key={index}>
                <div className="icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {features.map((feature, index) => (
          <section className="feature" data-aos="fade-up" key={index}>
            <div className="icon">{feature.icon}</div>
            <div>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
              <p className="api-line">📡 <strong>API:</strong> {feature.api}</p>
            </div>
          </section>
        ))}

        <section className="explain-section" data-aos="fade-up">
          <h2>🔬 Scientific Terms Explained</h2>
          <ul>
            {scientificTerms.map((item, idx) => (
              <li key={idx}>
                <strong>{item.term}:</strong> {item.definition}{" "}
                <a href={item.link} target="_blank" rel="noopener noreferrer">Learn More ↗</a>
              </li>
            ))}
          </ul>
        </section>

        {showScroll && (
          <button className="scroll-to-top" onClick={scrollToTop}>
            <FaArrowUp />
          </button>
        )}

        <footer className="footer">
          Built with 💫 science, ❤️ passion, and 🚀 purpose.
        </footer>
      </div>
    </CursorWrapper>
  );
};

const CursorWrapper = styled.div`
  cursor: none;
  
  * {
    cursor: none;
  }
`;

export default AboutPage;