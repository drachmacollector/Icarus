import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import useFlareData from "./Solar Flare/hooks/useFlareData";
import GlobeVisualizer from "./Solar Flare/components/GlobeVisualizer";
import Navbar from "./Navbar/Navbar";
import RiskPage from "./Solar Flare/pages/risk";
import AnalysisPage from "./Analysis/Analysis";
import CmeTracker from './CME/components/CmeTracker';
import News from './News/News'; 
import AuroraForecast from './Aurora/components/AuroraForecast';
import HeatMapGlobe from './HeatMap/components/HeatMapGlobe';
import HeatMapDashboard from './HeatMap/components/HeatMapDashboard';
import Kp from './Kp/Kp';
import Timeline from "./Timeline/Timeline";
import Home from "./Home/Home";
import AboutPage from './About/AboutPage';



export default function App() {
  const { flares, loading, error, refresh } = useFlareData();
  const [currentTime, setCurrentTime] = useState(new Date());

  return (
    <Router>
      <div className="relative h-screen w-screen text-white">
        <Navbar />

        <Routes>

          <Route path="/" element={<Home />} />

          <Route
            path="/Flare"
            element={<GlobeVisualizer flares={flares} currentTime={currentTime} />
            }/>
          <Route path="/Analysis" element={<AnalysisPage flares={flares} />} />
          <Route path="/Risk" element={<RiskPage />} />
          <Route path="/CmeTracker" element={<CmeTracker />} />
          <Route path="/News" element={<News />} />
          <Route path="/AuroraForecast" element={<AuroraForecast />} />
          <Route path="/HeatMapDashboard" element={<HeatMapDashboard />} />
          <Route path="/Kp" element={<Kp />} />
          <Route path="/Timeline" element={<Timeline />} />
          <Route path="/AboutPage" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
}
