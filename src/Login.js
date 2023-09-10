// Login.js
import React, { useState } from 'react';

function Login({ onLogin }) {
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Check if the entered password is correct (you can hardcode it for now)
    if (password === '123') {
      onLogin();
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login to access data</h1>
      <form onSubmit={handleLogin}>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
