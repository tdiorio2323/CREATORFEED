
import React, { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import DashboardScreen from './components/DashboardScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
    }
  };
  
  const handleLogout = () => {
      setIsLoggedIn(false);
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {isLoggedIn ? (
        <DashboardScreen onLogout={handleLogout} />
      ) : (
        <AuthScreen onLoginSuccess={() => handleLogin(true)} />
      )}
    </div>
  );
}
