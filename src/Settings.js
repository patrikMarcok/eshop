// Settings.js
import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebaseApp from './firebase';

function Settings() {
  const [iban, setIban] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [pricePerBottle, setPricePerBottle] = useState('');
  const [error, setError] = useState('');

  const handleSaveSettings = async (e) => {
    e.preventDefault();

    // Create an object with the settings data
    const settingsData = {
      iban,
      pricePerKg: parseFloat(pricePerKg),
      pricePerBottle: parseFloat(pricePerBottle),
    };

    // Access Firestore
    const db = getFirestore(firebaseApp);

    try {
      // Check if settings document exists, if not, create it
      const docRef = doc(db, 'settings', 'settingsData');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // If settings document exists, update it
        await setDoc(docRef, settingsData);
      } else {
        // If settings document doesn't exist, create it
        await setDoc(docRef, settingsData);
      }

      // Success message or redirection
      alert('Settings saved successfully!');
    } catch (error) {
      setError('Error saving settings. Please try again.');
      console.error('Error saving settings: ', error);
    }
  };

  useEffect(() => {
    // Fetch existing settings (if any) and populate the fields
    const fetchSettings = async () => {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, 'settings', 'settingsData');

      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setIban(data.iban || '');
          setPricePerKg(data.pricePerKg || '');
          setPricePerBottle(data.pricePerBottle || '');
        }
      } catch (error) {
        console.error('Error fetching settings: ', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <form onSubmit={handleSaveSettings}>
        <label>
          IBAN:
          <input
            type="text"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            required
          />
        </label>
        <br></br>
        <label>
          Price per Kg:
          <input
            type="number"
            value={pricePerKg}
            onChange={(e) => setPricePerKg(e.target.value)}
            required
          />
        </label>
        <br></br>
        <label>
          Price per Bottle:
          <input
            type="number"
            value={pricePerBottle}
            onChange={(e) => setPricePerBottle(e.target.value)}
            required
          />
        </label>
        <button type="submit">Save Settings</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Settings;
