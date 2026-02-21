# 🌎 Icarus 

**Icarus** is a comprehensive space weather dashboard designed to map geospatial solar events. By collecting and interpreting real-time data from  sources like NASA, NOAA, and ESA, Icarus transforms complex heliophysics datasets into intuitive 3D visualizations and interactive dashboards.

## 🌌 Core Features

The platform offers a unified interface for monitoring various space weather phenomena:

* **Solar Flare Tracker:** Detects flares in real-time and maps their locations on a rotating 3D globe.
* **CME Visualizer:** Animates the trajectory and estimates the risk of Coronal Mass Ejections (CMEs).
* **Aurora Forecast:** Provides dynamic aurora ring animations based on the NOAA Kp Index.
* **Global Heatmap:** Visualizes radiation and geomagnetic disturbances across the planet.
* **Interactive Activity Timeline:** Allows users to scroll through solar activity history and predictions.
* **Space News Feed:** Curates breaking headlines from NASA and the ESA.

## 🛠️ Tech Stack

### Frontend

* **React 19 & Vite:** A modern, high-performance foundation.
* **3D Visuals:** Powered by `react-globe.gl`, `three.js`, and `@react-three/fiber` for immersive Earth and solar event mapping.
* **Animations:** Utilizes **GSAP** and **AOS** (Animate On Scroll) for smooth transitions and reveals.
* **Styling:** Custom CSS combined with **Emotion** for styled components and glassmorphic UI elements.

### Data & APIs

* **NASA DONKI API:** Used for Solar Flare and CME tracking.
* **NOAA SWPC:** Powers the Kp Index and geomagnetic disturbance maps.
* **NASA & ESA RSS:** Feeds the real-time news dashboard.

## 📂 Project Structure

```text
src/
├── Solar Flare/      # Globe visualizers, risk dashboards, and flare hooks
├── CME/              # Tracking components for Coronal Mass Ejections
├── Aurora/           # Forecast and Kp Index visualization
├── HeatMap/          # Radiation and geomagnetic disturbance maps
├── News/             # Curated space weather news feed
├── Timeline/         # Historical solar activity visualization
├── Analysis/         # Detailed data analysis pages
├── About/            # Educational content and scientific term definitions
└── Navbar/           # Global navigation

```

## 🔬 Scientific Impact

Icarus is built to support **real-time awareness** for aviation, satellite operators, and power grid management, while also serving as an **educational tool** for students and hobbyists to learn about heliophysics and Earth-Sun interactions.

## 🚀 Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/drachmacollector/icarus.git

```


2. **Install dependencies:**
```bash
npm install

```


3. **Start the development server:**
```bash
npm run dev

```
