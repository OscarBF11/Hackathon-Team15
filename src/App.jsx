import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import DataConclusions from './pages/DataConclusions'
import DataConclusionsExample from './pages/DataConclusionsExample'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <DataConclusionsExample/>
    <DataConclusions/>

      
    </>
  )
}

export default App
