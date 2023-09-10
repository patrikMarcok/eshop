import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import firebaseApp from './firebase';
import './styles.css';

function CompletedData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const db = getFirestore(firebaseApp);
    const dataCollection = collection(db, 'med');

    const completedDataQuery = query(dataCollection, where('completed', '==', true));

    const querySnapshot = await getDocs(completedDataQuery);
    const completedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setData(completedData);
  }

  const handleUncomplete = async (id) => {
    const db = getFirestore(firebaseApp);
    const dataDocRef = doc(db, 'med', id);

    try {
      await updateDoc(dataDocRef, {
        completed: false,
      });

      // Refresh the completed data list after uncompleting
      fetchData();
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleDelete = async (id) => {
    const db = getFirestore(firebaseApp);
    const dataDocRef = doc(db, 'med', id);

    try {
      await deleteDoc(dataDocRef);
      // Refresh the completed data list after deletion
      fetchData();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <div className="list-container">
      <h1>History</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id} className="list-item">
            {item.first_name} - {item.second_name} - {item.amount}
            {item.telephone_number && <span> - Telephone Number: {item.telephone_number}</span>}
            {item.own_bottle && <span> - Own Bottle: Yes</span>}
            <button onClick={() => handleUncomplete(item.id)}>Uncomplete</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompletedData;
