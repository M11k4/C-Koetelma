import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from '../features/Home';
import Game from '../features/Game';
import Weather from '../features/Weather';
import Notes from '../features/Notes';
import '../../styles/App.css';

function Main() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </div>
  );
}

export default Main; 