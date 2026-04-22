import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { FaSun, FaBolt, FaRadiationAlt, FaCircleNotch } from "react-icons/fa";

const API_KEY = "7xojuNa1rk1mpSTQ5ZPG1oD60Yo4FvKUOuvIfn3w";
const BASE_URL = "https://api.nasa.gov/DONKI";

const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30); // Default: last 30 days
  const [activeCategory, setActiveCategory] = useState("all");

  const endpoints = {
    flares: "FLR",
    cmes: "CME",
    gst: "GST",
    hss: "HSS",
  };

  const loadEvents = async () => {
    setLoading(true);
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    try {
      const [flaresRes, cmesRes, gstRes, hssRes] = await Promise.all([
        axios.get(`${BASE_URL}/${endpoints.flares}?startDate=${startDate}&endDate=${endDate}&api_key=${API_KEY}`),
        axios.get(`${BASE_URL}/${endpoints.cmes}?startDate=${startDate}&endDate=${endDate}&api_key=${API_KEY}`),
        axios.get(`${BASE_URL}/${endpoints.gst}?startDate=${startDate}&endDate=${endDate}&api_key=${API_KEY}`),
        axios.get(`${BASE_URL}/${endpoints.hss}?startDate=${startDate}&endDate=${endDate}&api_key=${API_KEY}`),
      ]);

      const solarFlares = flaresRes.data.map(event => ({
        type: "flare",
        date: event.peakTime?.split("T")[0] || "Unknown",
        title: "Solar Flare",
        description: `Class: ${event.classType || "N/A"}, Source: ${event.sourceLocation || "Unknown"}`,
        icon: <FaSun />,
        color: "#FFD700",
        link: `https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/FLR/${event.flrID}`,
      }));

      const cmes = cmesRes.data.map(event => ({
        type: "cme",
        date: event.startTime?.split("T")[0] || "Unknown",
        title: "Coronal Mass Ejection (CME)",
        description: `Note: ${event.note || "No notes"}`,
        icon: <FaCircleNotch />,
        color: "#4db8ff",
        link: `https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/CME/${event.cmeAnalyses?.[0]?.cmeID || ""}`,
      }));

      const geomagneticStorms = gstRes.data.map(event => ({
        type: "gst",
        date: event.startTime?.split("T")[0] || "Unknown",
        title: "Geomagnetic Storm",
        description: `Kp Index: ${(event.kpIndex ?? []).map(k => k.kpIndex).join(", ") || "N/A"}`,
        icon: <FaBolt />,
        color: "#e67e22",
        link: `https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/GST/${event.gstID}`,
      }));

      const auroras = hssRes.data.map(event => ({
        type: "aurora",
        date: event.eventTime?.split("T")[0] || "Unknown",
        title: "Aurora Event (HSS)",
        description: `Instruments: ${(event.instruments ?? []).map(i => i.displayName).join(", ") || "N/A"}`,
        icon: <FaRadiationAlt />,
        color: "#00e1ff",
        link: `https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/HSS/${event.hssID}`,
      }));

      const allEvents = [...solarFlares, ...cmes, ...geomagneticStorms, ...auroras].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setEvents(allEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [days]);

  const filteredEvents = activeCategory === "all" 
    ? events 
    : events.filter(event => event.type === activeCategory);

  return (
    <div className="timeline-container-timeline">
      <div className="timeline-header">
        <div className="header-content">
          <h1>Space Weather Timeline</h1>
          <p>Historical record of solar events and space weather phenomena</p>
        </div>
        
        <div className="controls-container-timeline">
          <div className="time-selector">
            <label className="control-label">Time Range:</label>
            <select value={days} onChange={e => setDays(Number(e.target.value))}>
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>
          
          <div className="category-selector">
            <label className="control-label">Filter by Type:</label>
            <div className="category-buttons">
              <button 
                className={`category-btn ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                All Events
              </button>
              <button 
                className={`category-btn ${activeCategory === "flare" ? "active" : ""}`}
                onClick={() => setActiveCategory("flare")}
              >
                Solar Flares
              </button>
              <button 
                className={`category-btn ${activeCategory === "cme" ? "active" : ""}`}
                onClick={() => setActiveCategory("cme")}
              >
                CMEs
              </button>
              <button 
                className={`category-btn ${activeCategory === "gst" ? "active" : ""}`}
                onClick={() => setActiveCategory("gst")}
              >
                Geomagnetic Storms
              </button>
              <button 
                className={`category-btn ${activeCategory === "aurora" ? "active" : ""}`}
                onClick={() => setActiveCategory("aurora")}
              >
                Auroras
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container-timeline">
          <div className="loading-spinner"></div>
          <p>Loading cosmic events...</p>
        </div>
      ) : (
        <div className="timeline-wrapper">
          <VerticalTimeline lineColor="rgba(100, 200, 255, 0.2)">
            {filteredEvents.map((event, index) => (
              <VerticalTimelineElement
                key={index}
                date={event.date}
                dateClassName="timeline-date"
                iconStyle={{ 
                  background: event.color, 
                  color: "#fff",
                  boxShadow: `0 0 0 4px rgba(255,255,255,0.2), 0 0 15px ${event.color}`
                }}
                icon={event.icon}
                contentStyle={{ 
                  background: "rgba(25, 30, 50, 0.7)",
                  color: "#fff",
                  borderTop: `4px solid ${event.color}`,
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(10px)"
                }}
                contentArrowStyle={{ borderRight: "7px solid rgba(25, 30, 50, 0.7)" }}
              >
                <div className="timeline-card">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  {event.link && (
                    <a 
                      href={event.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="event-link"
                    >
                      View Event Source
                      <span className="link-icon">↗</span>
                    </a>
                  )}
                </div>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      )}
      
      <div className="space-background"></div>
    </div>
  );
};

export default Timeline;