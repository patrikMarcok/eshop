import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import firebaseApp from './firebase';

function CustomerLogin() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [signInError, setSignInError] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      // Check if the email in Firestore under 'users/actual' is set to '-1'
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, 'users', 'actual');

      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.email !== '-1') {
            // Email is not '-1', so redirect to '/post'
            navigate('/post');
          }
        }
      } catch (error) {
        console.error('Error checking user status: ', error);
      }
    };

    checkUserStatus();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const signedInUser = result.user;
      console.log('Successfully signed in with Google:', signedInUser);

      // Extract user information
      const { displayName, email } = signedInUser;
      
      let userFirstName = '';
    let userLastName = '';

    if (displayName) {
      const nameParts = displayName.split(' ');
      if (nameParts.length > 0) {
        userFirstName = nameParts[0];
        if (nameParts.length > 1) {
          userLastName = nameParts.slice(1).join(' ');
        }
      }
    }
      // Set user information in state
      setUser(signedInUser);
      setSignInError(null); // Reset any previous sign-in errors
      userLastName = ''
      // Send user information to Firebase Firestore
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, 'users', 'actual');
      const newData = {
        firstName: userFirstName,
        lastName: userLastName,
        email: email,
      };

      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await setDoc(docRef, newData);
        }

        navigate('/post');
      } catch (error) {
        console.error('Error fetching settings: ', error);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setSignInError(error.message); // Set the sign-in error message
    }
  };

  return (
    <div className="App">
      <h1>Google Sign-In</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}!</h2>
          <h3>Loading...</h3>
          {/* You can display user information here */}
        </div>
      ) : (
        <div>
          {signInError && <p>Error: {signInError}</p>}
          <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        </div>
      )}
    </div>
  );
}

export default CustomerLogin;
