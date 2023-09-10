import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
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

  const handleDelete = async (id) => {
    const db = getFirestore(firebaseApp);
    const dataDocRef = doc(db, 'med', id);

    try {
      await deleteDoc(dataDocRef);
      fetchData(); // Refresh the data after deletion
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const handleComplete = async (id) => {
    const db = getFirestore(firebaseApp);
    const dataDocRef = doc(db, 'med', id);

    try {
      await updateDoc(dataDocRef, {
        completed: true,
      });

      // Remove the completed item from the state
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <div className="list-container">
      <h1>Get Data</h1>
      <ul>
        {data
          .filter((item) => !item.completed) // Filter non-completed items
          .map((item) => (
            <li key={item.id} className="list-item">
              {item.first_name} - {item.second_name} - {item.amount}
              {item.telephone_number && <span> - Telephone Number: {item.telephone_number}</span>}
              {item.own_bottle && <span> - Own Bottle: Yes</span>}
              {!item.completed && (
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              )}
              {!item.completed && (
                <button onClick={() => handleComplete(item.id)}>Complete</button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default GetData;
