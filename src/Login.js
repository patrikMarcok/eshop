import React, { useState } from 'react';

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    // Simulate an API call to check the password (replace with actual authentication logic)
    if (password === '123') {
      // Successful login
      setError('');
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
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
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;
