import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import LocationPicker from './components/LocationPicker/LocationPicker';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<LocationPicker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;