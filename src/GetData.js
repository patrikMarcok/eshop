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
    <div className="table-container">
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Second Name</th>
            <th>Price</th> {/* Updated label to "Price" */}
            <th>Amount</th> {/* Displaying the original amount */}
            <th>Telephone Number</th>
            <th>Own Bottle</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((item) => !item.completed) // Filter non-completed items
            .map((item) => (
              <tr key={item.id} className="table-row">
                <td>{item.first_name}</td>
                <td>{item.second_name}</td>
                <td>{item.totalAmount || '-'}</td> {/* Display "Price" (totalAmount) */}
                <td>{item.amount}</td> {/* Display the original amount */}
                <td>{item.telephone_number || '-'}</td>
                <td>{item.own_bottle ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleComplete(item.id)}>Complete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default GetData;
