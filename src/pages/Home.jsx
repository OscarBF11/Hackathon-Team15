import { useState } from 'react';
import Header from '../components/Header';
import MapView from '../components/MapView';
import '../style/Home.css';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState(null);
    const [activeMap, setActiveMap] = useState('map1'); // Estado para controlar el mapa activo

    return (
        <div className="home-container">
            <Header onSearch={setSearchTerm} onFilter={setFilter} />
            <main className="main-content">
                <section className="map-section">
                    {/* Contenedor de Tabs alineado a la izquierda */}
                    <div className="tabs-container">
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

                    {/* Renderizar el mapa activo */}
                    {activeMap === 'map1' ? (
                        <MapView searchTerm={searchTerm} filter={filter} mapType="map1" />
                    ) : (
                        <MapView searchTerm={searchTerm} filter={filter} mapType="map2" />
                    )}
                </section>
            </main>
        </div>
    );
};

export default Home;
