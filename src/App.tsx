import React, { useState } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUpPage from './pages/SignUpPage';
import AdminPage from './pages/AdminPage';



function App() {
  const isAdmin = window.location.pathname === '/admin';

  if (isAdmin) {
    return <AdminPage />
  }

  return <SignUpPage />
}

export default App;









