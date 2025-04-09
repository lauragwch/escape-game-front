import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import NavBar from './Components/NavBar';
import AuthContext from './Contextes/AuthContext';
import { useState } from 'react';
import authService from './Services/AuthService';
import EscapeGamePage from './Pages/EscapeGamePage';
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
            <Route path="/escape-game/:id" element={<EscapeGamePage />} />
            {/* <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reservations" element={<ReservationPage />} /> */}
            {role === 'ADMIN' ? (
              <Route path="/admin" element={<AdminPage />} />
            ) : (
              <Route path="*" element={<HomePage />} />
            )}
            {/* Ajouter d'autres routes ici */}
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
