// GetData.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Import deleteDoc and doc
import firebaseApp from './firebase';
import './styles.css'; 

function GetData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const db = getFirestore(firebaseApp);
    const dataCollection = collection(db, 'med');

    const querySnapshot = await getDocs(dataCollection);
    const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setData(newData);
  }

  // Add a function to handle delete
  async function handleDelete(id) {
    const db = getFirestore(firebaseApp);
    const dataCollection = collection(db, 'med');
    const dataDoc = doc(dataCollection, id);

    try {
      await deleteDoc(dataDoc);
      fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  }

  return (
    <div className="list-container">
      <h1>Get Data</h1>
      <ul>
        {data.map((item, index) => (
          <li key={item.id} className="list-item">
            {item.first_name} - {item.second_name} - {item.amount}
            {item.own_bottle && <span> - Own Bottle: Yes</span>}
            <button onClick={() => handleDelete(item.id)}>Delete</button> {/* Add delete button */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GetData;
