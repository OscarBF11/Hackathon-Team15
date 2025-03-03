import { useState } from 'react'
import './App.css'
import MapView from './components/MapView' // Import the MapView component
import MapViewHeatmap from './components/MapView-heatmap' // Import the MapView-heatmap component

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div style={{ height: '100vh', width: '100vw' }}>
        {/* <MapView />  */}
        <MapViewHeatmap />

      </div>
    </>
  )
}

export default App
