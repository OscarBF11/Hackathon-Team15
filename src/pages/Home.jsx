import { useState } from 'react';
import DataAnalysis from '../components/DataAnalysis';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MapView from '../components/MapView';
import '../style/Home.css';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState(null);
    const [activeMap, setActiveMap] = useState('map1'); // Estado para cambiar de mapa
    const [analysisType, setAnalysisType] = useState('general'); // Estado para el tipo de análisis

    return (
        <div className="home-container">
            {/* Header mantiene la búsqueda y filtros */}
            <Header onSearch={setSearchTerm} onFilter={setFilter} />

            <main className="main-content">
                {/* Sección de Análisis de Datos */}
                <section className="data-analysis-section">
                    {/* Selector de tipo de análisis en la parte superior */}
                    <div className="analysis-selector" style={{ alignSelf: 'center', marginBottom: '20px' }}>
                        <label>Analysis Type:</label>
                        <select onChange={(e) => setAnalysisType(e.target.value)} value={analysisType}>
                            <option value="general">General Analysis (Tourism) - HeatMaps</option>
                            <option value="specific">Specific Place Analysis - Timeline + HeatMap</option>
                            <option value="multiple">Multiple Places Analysis - Timeline + HeatMap</option>
                        </select>
                    </div>
                    
                    {/* Componente de Análisis de Datos con el tipo seleccionado */}
                    <DataAnalysis analysisType={analysisType} />
                </section>

                {/* Sección del mapa */}
                <section className="map-section">
                    {/* Botones dentro del mapa */}
                    <div className="map-controls">
                        <button 
                            className={activeMap === 'map1' ? 'active' : ''} 
                            onClick={() => setActiveMap('map1')}
                        >
                            Mapa 1
                        </button>
                        <button 
                            className={activeMap === 'map2' ? 'active' : ''} 
                            onClick={() => setActiveMap('map2')}
                        >
                            Mapa 2
                        </button>
                    </div>

                    {/* Renderiza el mapa activo */}
                    <MapView searchTerm={searchTerm} filter={filter} mapType={activeMap} />
                </section>
            </main>

            {/* Footer único y corregido */}
            <Footer />
        </div>
    );
};

export default Home;
