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
    <div className="table-container">
      <h1>History</h1>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Second Name</th>
            <th>Amount</th>
            <th>Price</th>
            <th>Telephone Number</th>
            <th>Own Bottle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="table-row">
              <td>{item.first_name}</td>
              <td>{item.second_name}</td>
              <td>{item.amount}</td>
              <td>{item.totalAmount}</td>
              <td>{item.telephone_number || '-'}</td>
              <td>{item.own_bottle ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleUncomplete(item.id)}>Uncomplete</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
}

export default CompletedData;
