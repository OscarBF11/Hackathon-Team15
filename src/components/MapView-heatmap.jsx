import React, {useState, useEffect} from 'react';
import {Map, NavigationControl, useControl} from 'react-map-gl/maplibre';
import {ScatterplotLayer} from 'deck.gl';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import 'maplibre-gl/dist/maplibre-gl.css';
import responsePopulation from '../services/data/responsePopulation.json';
import { decode } from 'ngeohash';
import get_population from '../services/population';

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

let mapBounds = [
    {
        "latitude": 41.35793665464172,
        "longitude": 2.141346931457633
    },
    {
        "latitude": 41.35793665464172,
        "longitude": 2.11722850799552
    },
    {
        "latitude": 41.342891864892806,
        "longitude": 2.11722850799552
    },
    {
        "latitude": 41.342891864892806,
        "longitude": 2.141346931457633
    }
];

let lastFetch = Date.now();
let fetchTimer = null;

function Root() {
    const [data, setData] = useState([]);
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

    const fetchData = async () => {
    console.log('Fetching data...');
    const res = await get_population(
        mapBounds,
        '2025-03-04T11:00:00.000Z',
        '2025-03-04T11:39:59.000Z',
        7
    );

    console.log('Received items:', res.timedPopulationDensityData[0].cellPopulationDensityData.length);
    
    const formattedData = res.timedPopulationDensityData[0].cellPopulationDensityData.map(cell => ({
        ...cell,
        coordinates: decode(cell.geohash)
    }));

    lastFetch = Date.now();
    setData(formattedData);
    };

  useEffect(() => {
    fetchData();
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
      radiusMinPixels: 1,
      radiusMaxPixels: 50,
      lineWidthMinPixels: 0,
      getPosition: d => [d.coordinates.longitude, d.coordinates.latitude],
      getRadius: d => d.pplDensity / 1000,
      getFillColor: d => [255, 255, 0],
      getLineColor: d => [0, 255, 0]
    })
  ];

  async function updateMapBounds(bounds) {
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

    mapBounds = boundary;
    return boundary;
  }

  const handleMove = (event) => {
    const bounds = event.target.getBounds();
    updateMapBounds(bounds);
    console.log('mapBounds:', mapBounds);

    if (fetchTimer) {
        clearTimeout(fetchTimer);
    }

    fetchTimer = setTimeout(() => {
        fetchData();
    }, 200);
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

