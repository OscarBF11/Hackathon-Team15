import React, {useState, useEffect} from 'react';
import {Map, NavigationControl, useControl} from 'react-map-gl/maplibre';
import {ScatterplotLayer} from 'deck.gl';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import 'maplibre-gl/dist/maplibre-gl.css';
import responsePopulation from '../services/data/responsePopulation.json';
import { decode } from 'ngeohash';

const INITIAL_VIEW_STATE = {
    longitude: 2.1292877197265625,
    latitude:  41.35047912597656,
    zoom: 15,
    maxZoom: 16,
    pitch: 0,
    bearing: 0
  };

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
function DeckGLOverlay(props) {
  const overlay = useControl(() => new DeckOverlay(props));
  overlay.setProps(props);
  return null;
}

function Root() {
  const [data, setData] = useState([]);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  useEffect(() => {
    const formattedData = responsePopulation.timedPopulationDensityData[0].cellPopulationDensityData.map(cell => ({
      ...cell,
      coordinates: decode(cell.geohash)
    }));
    setData(formattedData);

    if (formattedData.length > 0) {
      const { latitude, longitude } = formattedData[0].coordinates;
      console.log('Latitude:', latitude, 'Longitude:', longitude);
    }
  }, []);

  const layers = [
    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: data,
      pickable: true,
      opacity: 0.3,
      stroked: false,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 20,
      radiusMaxPixels: 50,
      lineWidthMinPixels: 0,
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
      initialViewState={viewState} 
      mapStyle={MAP_STYLE}
      onMove={handleMove}
    >
      <DeckGLOverlay layers={layers} /* interleaved*/ />
      <NavigationControl position="top-left" />
    </Map>
  );
}

export default Root;

