// Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <div className="navigation">
      <div className="nav-box">
        <h2>Menu</h2>
        <ul>
          <li>
            <Link to="/">Get Data</Link>
          </li>
          <li>
            <Link to="/post">Post Data</Link>
          </li>
          <li>
            <Link to="/history">History</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
