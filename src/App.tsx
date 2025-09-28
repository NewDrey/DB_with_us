import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import {About} from "./pages/About";
import GridPage from "./pages/GridPage/GridPage";
import {TopBar} from "./components/TopBar/TopBar"


function App() {
  return (
      <Router>
          <TopBar />
        <Routes>
          <Route path="/" element={<GridPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
  );
}

export default App;
