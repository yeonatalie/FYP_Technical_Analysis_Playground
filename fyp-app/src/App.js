import React from 'react';
import './App.css';
import Navbar from './components/Navbar.js';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Tutorial from './pages/Tutorial';
import Backtest from './pages/Backtest';
  
function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/tutorial' element={<Tutorial />} />
          <Route exact path='/backtest' element={<Backtest />} />
        </Routes>
    </Router>
  );
}
  
export default App;

