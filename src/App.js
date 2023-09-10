import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GetData from './GetData';
import PostData from './PostData';
import Navigation from './Navigation';
import CompletedData from './History';
import Login from './Login'; // Import the Login component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Callback function to set the user as logged in
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Callback function to log the user out
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="content">
          {/* Use Routes as the parent */}
          <Routes>
            <Route path="/" element={isLoggedIn ? <GetData /> : <Login onLogin={handleLogin} />} />
            <Route path="/history" element={isLoggedIn ? <CompletedData /> : <Login onLogin={handleLogin} />} />
            <Route path="/post" element={!isLoggedIn && <PostData />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
