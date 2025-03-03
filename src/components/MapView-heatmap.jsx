import React, {useState, useEffect} from 'react';
import {Map, NavigationControl, useControl} from 'react-map-gl/maplibre';
import {ScatterplotLayer, LineLayer} from 'deck.gl';
import {PathStyleExtension} from '@deck.gl/extensions';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import 'maplibre-gl/dist/maplibre-gl.css';
import { decode } from 'ngeohash';
import get_population from '../services/population';

const yellow = [248, 255, 21];
const teal = [30, 186, 184];

const colorRange = [
    yellow, 
    teal
];

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

const AREA_LIMIT_POLYGON = [ [ 2.094570465035209, 41.281745129447089 ],
    [ 2.27079902501655, 41.432867822653769 ],
    [ 2.198406380044962, 41.477229645498312 ],
    [ 2.016571655638212, 41.382899835383817 ],
    [ 2.094570465035209, 41.281745129447089 ] 
];

function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
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

    const now = Date.now();
    const endDate = new Date(now).toISOString();
    const startDate = new Date(now).toISOString(); // 20 minutes ago
    const res = await get_population(
        mapBounds,
        startDate,
        endDate,
        7
    );

    console.log('Received items:', res.timedPopulationDensityData[0].cellPopulationDensityData.length);
    
    const formattedData = res.timedPopulationDensityData[0].cellPopulationDensityData.map(cell => ({
        ...cell,
        coordinates: decode(cell.geohash)
    }));

    lastFetch = Date.now();
    console.log(formattedData);
    setData(formattedData);
};

  useEffect(() => {
    fetchData();
  }, []);

let layers = [
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
        getRadius: d =>d.pplDensity ? (d.pplDensity || 0) / 1000 : 20,
        getFillColor: d => d.pplDensity ? yellow : teal,
        getLineColor: d => teal
    }),  
];

layers.push(
    new LineLayer({
        id: 'line-layer',
        data: AREA_LIMIT_POLYGON.map((point, index) => ({
            sourcePosition: point,
            targetPosition: AREA_LIMIT_POLYGON[(index + 1) % AREA_LIMIT_POLYGON.length]
        })),
        getSourcePosition: d => d.sourcePosition,
        getTargetPosition: d => d.targetPosition,
        getColor: yellow,
        getWidth: 2,
        getDashArray: [40, 20] // Dash pattern: 4px dash, 2px gap
    })
);

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

    const points = boundary.map(point => [point.longitude, point.latitude]);
    const isOutside = points.some(point => !isPointInPolygon(point, AREA_LIMIT_POLYGON));
    if (isOutside) {
      console.log('Map bounds are outside the area limit polygon');
    }

    return boundary;
  }

  const handleMove = (event) => {
    const bounds = event.target.getBounds();
    updateMapBounds(bounds);
    // console.log('mapBounds:', mapBounds);

    if (fetchTimer) {
        clearTimeout(fetchTimer);
    }

    fetchTimer = setTimeout(() => {
        fetchData();
    }, 50);
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

