import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar.js';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Tutorial from './pages/Tutorial';
import Custom from './pages/Custom';
import Button from 'react-bootstrap/Button';
  
function App() {
  return (    
    <div>
      <Router>
        <Navbar/>
          <Routes>
            <Route exact path='/' element={<Tutorial />} />
            <Route exact path='/custom-tutorial' element={<Custom />} />
            {/* <Route path="/" element={<Navigate replace to="/home" />} />
            <Route exact path='/home' element={<Home />} />
            <Route exact path='/tutorial' element={<Tutorial />} />
            <Route exact path='/custom-tutorial' element={<Custom />} />
            <Route exact path='/backtest' element={<Backtest />} /> */}
          </Routes>
      </Router>


    </div>
  );
}
  
export default App;

