import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function CustomerLogin() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Successfully signed in with Google:', user);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Google Sign-In Example</h1>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
}

export default CustomerLogin;
