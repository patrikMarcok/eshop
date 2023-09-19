import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import firebaseApp from './firebase';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

function PostData() {
  const [first_name, setFirstName] = useState('');
  const [second_name, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [telephone_number, setTelephoneNumber] = useState('');
  const [own_bottle, setOwnBottle] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [totalToPay, setTotalToPay] = useState(0);
  const [iban, setIban] = useState('');
  const [pricePerKg, setPricePerKg] = useState(0);
  const [pricePerBottle, setPricePerBottle] = useState(0);
  const [orderComplete, setOrderComplete] = useState(false);

  // Use the useLocation hook to get the state passed from the previous route
  const location = useLocation();
  const { state } = location;
const navigate = useNavigate();
  useEffect(() => {
    // Fetch IBAN, price per kg, and price per bottle from Firestore "settings" collection
    const db = getFirestore(firebaseApp);
    const settingsDocRef = doc(db, 'settings', 'settingsData');

    getDoc(settingsDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const settingsData = docSnapshot.data();
          setIban(settingsData.iban);
          setPricePerKg(settingsData.pricePerKg);
          setPricePerBottle(settingsData.pricePerBottle);
        } else {
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error fetching document:', error);
      });

    

      
      setEmail(getEmail)
      setFirstName(getFirstName)
      setSecondName(getSecondName)
      console.log(email)
    // Check if the email in the Firestore database is "-1"
    /*const userDocRef = doc(db, 'users', 'actual'); // Replace 'actual' with the actual document ID
    getDoc(userDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const userEmail = userData.email;

          if (userEmail !== '-1') {
            // Email is not "-1", so set the first name, last name, and email from the database
            setFirstName(userData.firstName);
            setSecondName(userData.lastName);
            setEmail(userEmail);
          }
        } else {
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error fetching user document:', error);
      });*/
  }, [state]);

  function getFirstName() {
    const first = sessionStorage.getItem('firstName');
    const firstName = JSON.parse(first);
    return firstName
  }
  function getSecondName(){
    const second = sessionStorage.getItem('secondName');
    const secondName = JSON.parse(second);
    return secondName
  }
  function getEmail(){
    const email1 = sessionStorage.getItem('email');
    const email = JSON.parse(email1);
    return email
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    switch (name) {
      case 'first_name':
        setFirstName(value);
        break;
      case 'second_name':
        setSecondName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'amount':
        setAmount(value);
        break;
      case 'telephone_number':
        setTelephoneNumber(value);
        break;
      case 'own_bottle':
        setOwnBottle(checked);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the "Amount" field contains only numbers
    let amountPattern = /^[0-9]+$/;
    if (!amountPattern.test(amount)) {
      alert('Please enter a valid amount (numbers only)');
      return; // Prevent submitting invalid data
    }

    // Calculate the payment amount based on the user's input
    let calculatedAmount = parseFloat(amount);

    // Calculate the total price based on the amount, price per kg, and price per bottle
    let totalPrice = calculatedAmount * parseFloat(pricePerKg);
    if (!own_bottle) {
      totalPrice += calculatedAmount * parseFloat(pricePerBottle);
    }

    // Update the totalToPay in the state
    setTotalToPay(totalPrice);

    // Show the summary popup
    setShowSummary(true);
  };

  const handlePayNow = async () => {
    // Calculate the payment amount based on the user's input
    let calculatedAmount = parseFloat(amount);

    // Calculate the total price based on the amount, price per kg, and price per bottle
    let totalPrice = calculatedAmount * parseFloat(pricePerKg);
    if (!own_bottle) {
      totalPrice += calculatedAmount * parseFloat(pricePerBottle);
    }

    // Create the payment link with the calculated amount and names
    let paymentLink = `https://payme.sk/?V=1&IBAN=${iban}&AM=${totalPrice}&CC=EUR&DT=20230908&MSG=ESHOP_${first_name}_${second_name}&CN=Marcok`;

    // Add the data to Firestore with the total amount
    const db = getFirestore(firebaseApp);

    try {
      const docRef = await addDoc(collection(db, 'med'), {
        first_name,
        second_name,
        email,
        amount: parseFloat(amount),
        totalAmount: totalPrice, // Store the total amount in the database
        telephone_number,
        own_bottle,
      });

      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }

    // Open the payment link in a new tab
    window.open(paymentLink, '_blank');
  };

  const handlePayLater = async () => {
    // Calculate the payment amount based on the user's input
    let calculatedAmount = parseFloat(amount);

    // Calculate the total price based on the amount, price per kg, and price per bottle
    let totalPrice = calculatedAmount * parseFloat(pricePerKg);
    if (!own_bottle) {
      totalPrice += calculatedAmount * parseFloat(pricePerBottle);
    }

    // Close the summary popup
    setShowSummary(false);
    setOrderComplete(true);

    // Clear the form after successfully adding the document
    setFirstName('');
    setSecondName('');
    setEmail('');
    setAmount('');
    setTelephoneNumber('');
    setOwnBottle(false);
    setTotalToPay(0);

    // Add the data to Firestore with the total amount
    const db = getFirestore(firebaseApp);

    try {
      const docRef = await addDoc(collection(db, 'med'), {
        first_name,
        second_name,
        email,
        amount: parseFloat(amount),
        totalAmount: totalPrice, // Store the total amount in the database
        telephone_number,
        own_bottle,
      });

      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleLogout = async () => {
    // Set email and other values in the Firestore database to "-1"
    const db = getFirestore(firebaseApp);
    const userDocRef = doc(db, 'users', 'actual'); // Replace 'actual' with the actual document ID
    sessionStorage.clear()
    navigate('/customerLogin')
    /*try {
      await setDoc(userDocRef, {
        email: '-1',
        firstName: '',
        secondName: '',
      });*/
      navigate('/customerLogin')
      // Clear the form and state
      setFirstName('');
      setSecondName('');
      setEmail('');
      setAmount('');
      setTelephoneNumber('');
      setOwnBottle(false);
      setTotalToPay(0);

      console.log('User logged out successfully.');
    /*} catch (error) {
      console.error('Error logging out user:', error);
    }*/
  };

  return (
    <div>
      {email !== '-1' && (
        <div>
          <h2>Welcome, {first_name}!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      <h3>Objednávka medu</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Meno:
          <input
            type="text"
            name="first_name"
            value={first_name}
            onChange={handleChange}
            required // Make it a required field
          />
        </label>
        <br />
        <label>
          Priezvisko:
          <input
            type="text"
            name="second_name"
            value={second_name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Množstvo(kg):
          <input
            type="text"
            name="amount"
            value={amount}
            onChange={handleChange}
            pattern="[0-9]+" // Use the pattern attribute for numbers only
            required // Make it a required field
          />
        </label>
        <br />
        <label>
          Telefónne číslo:
          <input
            type="text"
            name="telephone_number"
            value={telephone_number}
            onChange={handleChange}
            required // Make it a required field
          />
        </label>
        <br />
        <label>
          Prinesiem vlastné fľaše(osobný odber):
          <input
            type="checkbox"
            name="own_bottle"
            checked={own_bottle}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Ďalej</button>
      </form>

      {/* Summary Popup */}
      {showSummary && (
        <div className="summary-popup">
          <h2>Summary</h2>
          <p>First Name: {first_name}</p>
          <p>Second Name: {second_name}</p>
          <p>Email: {email}</p>
          <p>Amount: {amount}</p>
          <p>Total to Pay: {totalToPay}</p>
          <button onClick={handlePayNow}>Pay Now</button>
          <button onClick={handlePayLater}>Pay Later</button>
        </div>
      )}

      {/* Order Complete Message */}
      {orderComplete && (
        <div className="order-complete">
          <h2>Objednávka prijatá!</h2>
          <p>Zaplatiť môžete neskôr.</p>
        </div>
      )}
    </div>
  );
}

export default PostData;
