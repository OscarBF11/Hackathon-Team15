import { ScreenGridLayer } from "@deck.gl/layers";
import { DeckGL } from "@deck.gl/react";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

// Example density data
const densityData = [
  { position: [40.4165, -3.7038], count: 80 }, // Station 1 (High)
  { position: [40.4153, -3.7074], count: 50 }, // Station 2 (Medium)
  { position: [40.4076, -3.6914], count: 30 }, // Station 3 (Low)
];

// Define colors based on density 
const COLOR_RANGE = [
  [0, 255, 0, 80],     // Green (Low density)
  [255, 165, 0, 160],  // Orange (Medium density)
  [255, 0, 0, 255],    // Red (High density)
];

const SCREEN_GRID_LAYER = new ScreenGridLayer({
  id: "screen-grid-layer",
  data: densityData,
  getPosition: (d) => d.position,
  getWeight: (d) => d.count, // Defines how weight is calculated
  cellSizePixels: 60, // Grid cell size in pixels
  colorRange: COLOR_RANGE,
  opacity: 0.7,
  gpuAggregation: true, // Uses GPU acceleration for rendering
});

const DeckOverlay = () => {

  return (
    <DeckGL
      initialViewState={{
        longitude: -3.7038,
        latitude: 40.4165,
        zoom: 13,
      }}
      controller={true}
      layers={[SCREEN_GRID_LAYER]}
    />
  );
};

const GridMap = () => {
  return (
    <MapContainer center={[40.4165, -3.7038]} zoom={13} style={{ height: "100vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <DeckOverlay />
    </MapContainer>
  );
};

export default GridMap;
