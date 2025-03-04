import { useState } from "react";
import MapViewHeatmap from "../components/MapView-heatmap";
import "../style/Home.css";

export default function Dashboard() {
  const [selectedOption, setSelectedOption] = useState("analyze");
  const [coordinates, setCoordinates] = useState([{ lat: "", lon: "" }]); // Inicializa con un campo vacío

  // Función para actualizar los valores de latitud/longitud en la lista
  const handleCoordinateChange = (index, field, value) => {
    const newCoordinates = [...coordinates];
    newCoordinates[index][field] = value;
    setCoordinates(newCoordinates);
  };

  // Función para agregar un nuevo conjunto de campos
  const addCoordinateField = () => {
    setCoordinates([...coordinates, { lat: "", lon: "" }]); // Agrega un nuevo campo vacío
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>SMART TRANSPORT ANALYSIS</h1>
      </header>

      <div className="content-wrapper">
        {/* Data Analytics Section */}
        <section className="data-container">
          <h2>Data Analytics</h2>
          <div className="analysis-selector">
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="analyze">General analysis</option>
              <option value="specific-place">
                Analysis of a specific place (Categories: specific place)
              </option>
              <option value="multiple-places">
                Analysis of several specific places (Categories: various specific places)
              </option>
            </select>
          </div>

          {/* Sección dinámica basada en la selección */}
          <div className="analysis-description">
            {selectedOption === "specific-place" && (
              <div className="coordinates-input">
                <input
                  type="text"
                  placeholder="Enter latitude"
                  value={coordinates[0].lat}
                  onChange={(e) => handleCoordinateChange(0, "lat", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter longitude"
                  value={coordinates[0].lon}
                  onChange={(e) => handleCoordinateChange(0, "lon", e.target.value)}
                />
              </div>
            )}

            {selectedOption === "multiple-places" && (
              <div className="multiple-coordinates">
                {coordinates.map((coord, index) => (
                  <div key={index} className="coordinates-input">
                    <input
                      type="text"
                      placeholder={`Latitude ${index + 1}`}
                      value={coord.lat}
                      onChange={(e) => handleCoordinateChange(index, "lat", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder={`Longitude ${index + 1}`}
                      value={coord.lon}
                      onChange={(e) => handleCoordinateChange(index, "lon", e.target.value)}
                    />
                  </div>
                ))}
                <button onClick={addCoordinateField}>Add more</button>
              </div>
            )}
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section">
          <h2>Map View</h2>
          <div className="map-placeholder">
            <MapViewHeatmap />
            {/* <span>Map Placeholder</span> */}
          </div>
        </section>
      </div>
    </div>
  );
}