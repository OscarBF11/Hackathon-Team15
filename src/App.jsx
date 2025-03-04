import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Home from './pages/Home';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
