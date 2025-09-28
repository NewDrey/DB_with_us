import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import {About} from "./pages/About";
import GridPage from "./pages/GridPage/GridPage";
import {TopBar} from "./components/TopBar/TopBar"
import {ThemeProvider} from './ts/ThemeContext/ThemeContext'


function App() {
  return (
      <ThemeProvider>
      <Router>
          <TopBar />
        <Routes>
          <Route path="/" element={<GridPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
      </ThemeProvider>
  );
}

export default App;
