import React, {useState, useEffect} from 'react';
import {Map, NavigationControl, Marker, useControl} from 'react-map-gl/maplibre';
import {GeoJsonLayer, LineLayer} from 'deck.gl';
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

  const METERS_TO_DEGREES = 1 / 111320; // Approximate conversion factor for meters to degrees

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

let fetchTimer = null;

let minDensity = 0;
let maxDensity = 0;
let minOpacity = 0.005;
let maxOpacity = 0.4;

const trainStations = [
//   { name: 'Barcelona Sants', latitude: 41.378, longitude: 2.140 },
//   { name: 'Passeig de Gràcia', latitude: 41.391, longitude: 2.165 },
//   { name: 'Estació de França', latitude: 41.384, longitude: 2.183 },
//   { name: 'Plaça de Catalunya', latitude: 41.387, longitude: 2.170 },
//   { name: 'Arc de Triomf', latitude: 41.391, longitude: 2.180 },
//   { name: 'Sagrera', latitude: 41.422, longitude: 2.186 }
];

function Root() {
    const [data, setData] = useState([]);
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

    const fetchData = async () => {
    console.log('Fetching data...');

    const now = Date.now();
    const endDate = new Date(now);
    endDate.setMinutes(0, 0, 0); // Set to the last full hour
    const startDate = new Date(endDate);
    startDate.setHours(endDate.getHours() - 1); // 1 hour before the last full hour
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

    const densities = formattedData.map(d => d.pplDensity).filter(d => !isNaN(d));
    minDensity = Math.min(...densities);
    maxDensity = Math.max(...densities);

    console.log(formattedData);
    setData(formattedData);
};

  useEffect(() => {
    fetchData();
  }, []);


const getOpacity = (density) => {
    const densityRatio = (density - minDensity) / (maxDensity - minDensity);
    const opacity = minOpacity + densityRatio * (maxOpacity - minOpacity);
    return opacity;
};

const getFillColor = (density) => {
    let color =  density ? yellow : teal;
    const opacity = getOpacity(density);
    return color.concat(opacity * 255);
}



const layers = [
  new GeoJsonLayer({
    id: 'geojson-layer',
    data: {
      type: 'FeatureCollection',
      features: data.map(d => ({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [d.coordinates.longitude - 75 * METERS_TO_DEGREES, d.coordinates.latitude - 75 * METERS_TO_DEGREES],
            [d.coordinates.longitude + 75 * METERS_TO_DEGREES, d.coordinates.latitude - 75 * METERS_TO_DEGREES],
            [d.coordinates.longitude + 75 * METERS_TO_DEGREES, d.coordinates.latitude + 75 * METERS_TO_DEGREES],
            [d.coordinates.longitude - 75 * METERS_TO_DEGREES, d.coordinates.latitude + 75 * METERS_TO_DEGREES],
            [d.coordinates.longitude - 75 * METERS_TO_DEGREES, d.coordinates.latitude - 75 * METERS_TO_DEGREES]
          ]]
        },
        properties: {
          density: d.pplDensity,
        }
      }))
    },
    filled: true,
    getFillColor: d => getFillColor(d.properties.density),
    getLineColor: [0, 0, 0, 0], // No border color
    // opacity: 0.2,
    stroked: false,
    extruded: false
  }),
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
        {trainStations.map(station => (
            <Marker key={station.name} latitude={station.latitude} longitude={station.longitude}>
                <div style={{ backgroundColor: `rgb(${teal.join(',')})`, borderRadius: '50%', width: '10px', height: '10px' }} />
            </Marker>
        ))}
    </Map>
);
}

export default Root;

