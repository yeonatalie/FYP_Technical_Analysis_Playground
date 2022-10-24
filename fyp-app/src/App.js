import React from 'react';
import './App.css';
import Navbar from './components/Navbar.js';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Navigate } from "react-router-dom";
import Home from './pages/Home';
import Tutorial from './pages/Tutorial';
import Backtest from './pages/Backtest';
import Custom from './pages/Custom';
  
function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route exact path='/home' element={<Home />} />
          <Route exact path='/tutorial' element={<Tutorial />} />
          <Route exact path='/custom-tutorial' element={<Custom />} />
          <Route exact path='/backtest' element={<Backtest />} />
        </Routes>
    </Router>
  );
}
  
export default App;

