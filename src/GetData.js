// GetData.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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
      const newData = querySnapshot.docs.map((doc) => doc.data());
      setData(newData);
    }

    fetchData();
  }, []);

  return (
    <div className="list-container">
      <h1>Get Data</h1>
      <ul>
        {data.map((item, index) => (
        <li key={index} className="list-item">
          {item.first_name} - {item.second_name} - {item.amount}
        </li>

          
        ))}
      </ul>
    </div>
  );
}

export default GetData;
