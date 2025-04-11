import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import NavBar from './Components/NavBar';
import AuthContext from './Contextes/AuthContext';
import { useState } from 'react';
import authService from './Services/AuthService';
import EscapeGamePage from './Pages/EscapeGamePage';
import ReservationPage from './Pages/ReservationPage';
import LoginPage from './Pages/LoginPage';
import EspaceClient from './Pages/EspaceClient';
import EscapeGamesPage from './Pages/EscapeGamesPage'; 
// import ReservationsPage from './Pages/ReservationsPage';
// import ContactPage from './Pages/ContactPage';
// import AdminPage from './Pages/AdminPage';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(authService.isConnected());
  const [role, setRole] = useState(authService.getRole());
  const [user, setUser] = useState(authService.getUser());

  return (
    <AuthContext.Provider value={{ isConnected, setIsConnected, role, setRole, user, setUser }}>
      <BrowserRouter>
        <NavBar />
        <div className="page-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/escape-games" element={<EscapeGamesPage />} />
            <Route path="/escape-game/:id" element={<EscapeGamePage />} />
            {/* <Route path="/reservations" element={<ReservationsPage />} /> */}
            <Route path="/reservation/:id" element={<ReservationPage />} />
            {/* <Route path="/contact" element={<ContactPage />} /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/espace-client" element={<EspaceClient />} />
            {role === 'ADMIN' && <Route path="/admin" element={<AdminPage />} />}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
