import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  doc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import getAuth from Firebase Authentication
import firebaseApp from './firebase';
import './styles.css';

function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [isCustomerSignedIn, setIsCustomerSignedIn] = useState(false); // State to track customer sign-in status
  const auth = getAuth(); // Get the auth object

  useEffect(() => {
    // Check if the customer is signed in when the component mounts
    checkCustomerSignInStatus();
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const db = getFirestore(firebaseApp);
  
    // Replace 'med' with your Firestore collection name
    const ordersCollection = collection(db, 'med');
    const q = query(ordersCollection, where('email', '==', auth.currentUser.email)); // Use auth object to access the current user's email
  
    try {
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders: ', error);
    }
  }
  

  async function checkCustomerSignInStatus() {
    const db = getFirestore(firebaseApp);
    const userDocRef = doc(db, 'users', 'actual');

    try {
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        // Check if the 'email' field is not equal to '-1' to determine if the customer is signed in
        if (userData.email !== '-1') {
          setIsCustomerSignedIn(true);
        } else {
          setIsCustomerSignedIn(false);
        }
      }
    } catch (error) {
      console.error('Error checking customer sign-in status:', error);
    }
  }

  const handleDelete = async (id) => {
    const db = getFirestore(firebaseApp);
    const orderDocRef = doc(db, 'med', id);

    try {
      await deleteDoc(orderDocRef);
      fetchOrders(); // Refresh the data after deletion
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <div className="table-container">
      <h1>Your Orders</h1>
      {isCustomerSignedIn ? (
        <div>
          <p>You are signed in as a customer.</p>
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
          {orders.map((order) => (
            <tr key={order.id} className="table-row">
              <td>{order.first_name}</td>
              <td>{order.second_name}</td>
              <td>{order.totalAmount || '-'}</td> {/* Display "Price" (totalAmount) */}
              <td>{order.amount}</td> {/* Display the original amount */}
              <td>{order.telephone_number || '-'}</td>
              <td>{order.own_bottle ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleDelete(order.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
          </table>
        </div>
      ) : (
        <p>You are not signed in as a customer.</p>
      )}
    </div>
  );
}

export default CustomerOrders;
