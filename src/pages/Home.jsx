import { useState } from 'react';
import Header from '../components/Header';
import MapView from '../components/MapView';
import '../style/Home.css';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState(null);
    const [activeMap] = useState('map1'); // Estado para controlar el mapa activo
    const [analysisType, setAnalysisType] = useState('general'); // Estado para el tipo de análisis

    return (
        <div className="home-container">
            <Header onSearch={setSearchTerm} onFilter={setFilter} />
            <main className="main-content">
                <section className="map-section">
                <div className="analysis-buttons">
                        <button 
                            className={analysisType === 'general' ? 'active' : ''} 
                            onClick={() => setAnalysisType('general')}
                        >
                            General Analysis (Tourism)
                        </button>
                        <button 
                            className={analysisType === 'specific' ? 'active' : ''} 
                            onClick={() => setAnalysisType('specific')}
                        >
                            Specific Location Analysis
                        </button>
                        <button 
                            className={analysisType === 'multiple' ? 'active' : ''} 
                            onClick={() => setAnalysisType('multiple')}
                        >
                            Analysis of various places
                        </button>
                    </div>
                

                    {/* Renderizar el mapa activo */}
                    {activeMap === 'map1' ? (
                        <MapView searchTerm={searchTerm} filter={filter} mapType="map1" analysisType={analysisType} />
                    ) : (
                        <MapView searchTerm={searchTerm} filter={filter} mapType="map2" analysisType={analysisType} />
                    )}
                </section>
            </main>
        </div>
    );
};

export default Home;
