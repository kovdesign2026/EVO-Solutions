import React, { useState, useEffect } from 'react';
import { View, StatusBar, Platform } from 'react-native';

// El fix para el autofill se movió dentro del componente para ser sensible al tema

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [authRoute, setAuthRoute] = useState('Login');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'autofill-fix';
      let style = document.getElementById(styleId);
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
      }
      const textColor = isDarkMode ? '#F9FAFB' : '#0A1C40';
      style.innerHTML = `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active  {
            -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
            -webkit-text-fill-color: ${textColor} !important;
            transition: background-color 5000s ease-in-out 0s;
            border: none !important;
            border-radius: inherit !important;
        }
      `;
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  const themeProps = { isDarkMode, toggleTheme };

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#0A0E17' : '#F3F4F6' }}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={isDarkMode ? '#0A0E17' : '#F3F4F6'} 
      />
      {user ? (
        <HomeScreen user={user} onLogout={handleLogout} {...themeProps} />
      ) : authRoute === 'Login' ? (
        <LoginScreen 
          onLogin={handleLogin} 
          onNavigateRegister={() => setAuthRoute('Register')} 
          {...themeProps} 
        />
      ) : (
        <RegisterScreen 
          onNavigateLogin={() => setAuthRoute('Login')} 
          {...themeProps} 
        />
      )}
    </View>
  );
}
