import React, { useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firebase functions

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordFetched, setIsPasswordFetched] = useState(false); // Track if the password is fetched

  // Function to fetch the password from Firebase
  const fetchPasswordFromFirebase = async () => {
    const db = getFirestore(); // Initialize Firestore
    const settingsDocRef = doc(db, 'settings', 'settingsData'); // Replace with your document ID

    try {
      const docSnapshot = await getDoc(settingsDocRef);
      if (docSnapshot.exists()) {
        const settingsData = docSnapshot.data();
        const fetchedPassword = settingsData.password;
        return fetchedPassword; // Return the fetched password
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching password from Firebase: ', error);
    }

    return ''; // Return an empty string if the password is not found
  };

  
  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if the password is fetched before proceeding
    if (!isPasswordFetched) {
      const fetchedPassword = await fetchPasswordFromFirebase();
      if (fetchedPassword === '') {
        setError('Error fetching password from Firebase.');
        return;
      }
      setPassword(fetchedPassword); // Set the fetched password
      setIsPasswordFetched(true); // Mark the password as fetched
    }

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
