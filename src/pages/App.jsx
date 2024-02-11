import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import AutenticationPage from './autentication';
import HomePage from './homePage';
import MenuOptions from '../components/menu/menu';
import '../css/App.css';
import SchedulePage from './schedulePage';
import TeamPage from './teamPage';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <React.Fragment>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/" element={<AutenticationPage />} />
      </Routes>
      {location.pathname !== "/" && <MenuOptions />}
    </React.Fragment>
  );
}

export default App;
