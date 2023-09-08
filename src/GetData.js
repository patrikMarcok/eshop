// GetData.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Import Firestore functions
import firebaseApp from './firebase';
import './styles.css'; 

function GetData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Create a Firestore instance
    const db = getFirestore(firebaseApp);

    // Reference a Firestore collection
    const dataCollection = collection(db, 'med'); // Replace with your collection name

    // Fetch data from the collection
    async function fetchData() {
      const querySnapshot = await getDocs(dataCollection);
      const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Include document ID
      setData(newData);
    }

    fetchData();
  }, []);

  // Function to handle item deletion
  async function handleDelete(documentId) {
    const db = getFirestore(firebaseApp);
    const dataRef = doc(db, 'med', documentId);

    try {
      await deleteDoc(dataRef);
      // After successful deletion, you may want to update the state to remove the deleted item from the UI.
      // You can fetch data again to refresh the list.
      fetchData();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }

  return (
    <div className="list-container">
      <h1>Get Data</h1>
      <ul>
        {data.map((item, index) => (
          <li key={item.id} className="list-item">
            {item.first_name} - {item.second_name} - {item.amount}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GetData;
