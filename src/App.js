import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import GetData from './GetData';
import CompletedData from './History';
import Login from './Login';
import PostData from './PostData';
import Settings from './Settings';
import Contact from './Contact';



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
    <Router basename='/eshop'>
      <div className="App">
        <nav>
          <ul>
            {!isLoggedIn ? (
              <React.Fragment>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/post">Nová objednávka</Link>
              </li>
              <li>
                <Link to="/contact">Kontakt</Link>
              </li>
              
              </React.Fragment>
            ) : (
              <React.Fragment>
                
                <li>
                  <Link to="/history">History</Link>
                </li>
                <li>
                  <Link to="/">Orders</Link>
                </li>
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </React.Fragment>
            )}
          </ul>
        </nav>
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={isLoggedIn ? <GetData /> : <Navigate to="/post" />}
            />
            <Route path="/post" element={<PostData />} />
            <Route
              path="/login"
              element={
                !isLoggedIn ? (
                  <Login onLogin={handleLogin} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/history"
              element={isLoggedIn ? <CompletedData /> : <Navigate to="/post" />}
            />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/post" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
