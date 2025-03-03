import React, {useState, useEffect} from 'react';
import {Map, NavigationControl, useControl} from 'react-map-gl/maplibre';
import {ScatterplotLayer} from 'deck.gl';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import 'maplibre-gl/dist/maplibre-gl.css';
import responsePopulation from '../services/data/responsePopulation.json';
import { decode } from 'ngeohash';

const INITIAL_VIEW_STATE = {
    latitude: 45.754114,
    longitude: 4.860374,
    zoom: 12,
    bearing: 0,
    pitch: 30
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
function DeckGLOverlay(props) {
  const overlay = useControl(() => new DeckOverlay(props));
  overlay.setProps(props);
  return null;
}

function Root() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const formattedData = responsePopulation.timedPopulationDensityData.flatMap(entry => 
      entry.cellPopulationDensityData.map(cell => ({
        ...cell,
        coordinates: decode(cell.geohash)
      }))
    );
    console.log(formattedData);
    setData(formattedData);
  }, []);

  const layers = [
    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: data,
      pickable: true,
      opacity: 0.8,
      stroked: false,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 20,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => [d.coordinates.longitude, d.coordinates.latitude],
      getRadius: d => d.pplDensity / 1000,
      getFillColor: d => [255, 255, 0],
      getLineColor: d => [0, 255, 0]
    })
  ];

  const handleMove = (event) => {
    const bounds = event.target.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const nw = { lat: ne.lat, lng: sw.lng };
    const se = { lat: sw.lat, lng: ne.lng };

    const boundary = [
      { latitude: ne.lat, longitude: ne.lng }, // Northeast
      { latitude: nw.lat, longitude: nw.lng }, // Northwest
      { latitude: sw.lat, longitude: sw.lng }, // Southwest
      { latitude: se.lat, longitude: se.lng }  // Southeast
    ];

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const formattedBoundary = {
      area: {
        areaType: "POLYGON",
        boundary: boundary
      },
      startDate: oneHourAgo.toISOString(),
      endDate: now.toISOString(),
      precision: 7
    };

    // console.log('Formatted Boundary:', formattedBoundary);
  };

  return (
    <Map 
      initialViewState={INITIAL_VIEW_STATE} 
      mapStyle={MAP_STYLE}
      onMove={handleMove}
    >
      <DeckGLOverlay layers={layers} /* interleaved*/ />
      <NavigationControl position="top-left" />
    </Map>
  );
}

export default Root;

