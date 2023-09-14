import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import GetData from './GetData';
import CompletedData from './History';
import Login from './Login';
import PostData from './PostData';
import Settings from './Settings';
import Contact from './Contact';
import CustomerLogin from './CustomerLogin';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  // Callback function to set the user as logged in as an admin
  const handleAdminLogin = () => {
    setIsLoggedIn(true);
  };

  // Callback function to log out as an admin
  const handleAdminLogout = () => {
    setIsLoggedIn(false);
  };
const handleCustomerLoginSet = () => {
    setIsCustomerLoggedIn(true);
    
    console.log("isCustomerLoggedIn updated to true");

    const checkCustomerLoginStatus = async () => {
      const db = getFirestore(); // You might need to pass your firebaseApp here

      // Replace 'users/actual' with the actual path to your user data in Firestore
      const userDocRef = doc(db, 'users', 'actual');

      try {
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();

          // Check if the 'email' field is not equal to '-1' to determine if the customer is logged in
          if (userData.email !== '-1') {
            setIsCustomerLoggedIn(true);
          } else {
            setIsCustomerLoggedIn(false);
          }
        }
      } catch (error) {
        console.error('Error checking customer login status:', error);
      }
    };
  };
  // Callback function to set the user as logged in as a customer
  const handleCustomerLogin = async () => {
    handleCustomerLoginSet();

  };

  // Callback function to log out as a customer
  const handleCustomerLogout = () => {
    handleCustomerLoginSet();
  };

  

  return (
    <Router basename="/eshop">
      <div className="App">
        <nav>
          <ul>
            {!isCustomerLoggedIn && !isLoggedIn ? (
              // Condition for not logged in
              <React.Fragment>
                <li>
                  <Link to="/login">Admin Login</Link>
                </li>
                <li>
                  <Link to="/customerlogin">Customer Login</Link>
                </li>
                <li>
                  <Link to="/contact">Kontakt</Link>
                </li>
              </React.Fragment>
            ) : isCustomerLoggedIn ? (
              // Condition for logged in as a customer
              <React.Fragment>
                <li>
                  <Link to="/post">Orders</Link>
                </li>
                
              </React.Fragment>
            ) : (
              // Condition for logged in as an admin
              <React.Fragment>
                <li>
                  <Link to="/post">Nová objednávka</Link>
                </li>
                <li>
                  <Link to="/">Objednávky</Link>
                </li>
                <li>
                  <Link to="/history">Historia</Link>
                </li>
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
                <li>
                  <button onClick={handleAdminLogout}>Admin Logout</button>
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
                  <Login onLogin={handleAdminLogin} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/customerlogin"
              element={
                !isCustomerLoggedIn ? (
                  <CustomerLogin onLogin={handleCustomerLogin} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/history"
              element={isLoggedIn ? <CompletedData /> : <Navigate to="/post" />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/settings"
              element={isLoggedIn ? <Settings /> : <Navigate to="/post" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
