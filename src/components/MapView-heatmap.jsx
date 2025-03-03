import React, {useState} from 'react';
import {Map, NavigationControl, Popup, useControl} from 'react-map-gl/maplibre';
import {GeoJsonLayer, ArcLayer} from 'deck.gl';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import 'maplibre-gl/dist/maplibre-gl.css';


const INITIAL_VIEW_STATE = {
    latitude: 41.3851,
    longitude: 2.1734,
    zoom: 12,
    bearing: 0,
    pitch: 30
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
function DeckGLOverlay(props) {
  const overlay = useControl(() => new DeckOverlay(props));
  overlay.setProps(props);
  return null;
}

function Root() {
  const [selected, setSelected] = useState(null);

  const layers = [];

  const handleMove = (event) => {

    const bounds = event.target.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const nw = { lat: ne.lat, lng: sw.lng };
    const se = { lat: sw.lat, lng: ne.lng };

    const boundaryPoints = [
      { lat: ne.lat, lng: ne.lng }, // Northeast
      { lat: nw.lat, lng: nw.lng }, // Northwest
      { lat: sw.lat, lng: sw.lng }, // Southwest
      { lat: se.lat, lng: se.lng }  // Southeast
    ];

    console.log('Boundary Points:', boundaryPoints);
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

