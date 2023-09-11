import React, { Component } from 'react';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import firebaseApp from './firebase';

class PostData extends Component {
  constructor() {
    super();
    this.state = {
      first_name: '',
      second_name: '',
      amount: '',
      telephone_number: '', // Add telephone_number field
      own_bottle: false,
      showSummary: false, // To control the summary popup
      totalToPay: 0,
      iban: '', // IBAN from Firestore
      pricePerKg: 0, // Price per kg from Firestore
      pricePerBottle: 0, // Price per bottle from Firestore
      orderComplete: false, // State to control the "Order Complete" message
    };
  }

  componentDidMount() {
    // Fetch IBAN, price per kg, and price per bottle from Firestore "settings" collection
    const db = getFirestore(firebaseApp);
    const settingsDocRef = doc(db, 'settings', 'settingsData'); // Replace with your document ID

    getDoc(settingsDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const settingsData = docSnapshot.data();
          this.setState({
            iban: settingsData.iban,
            pricePerKg: settingsData.pricePerKg,
            pricePerBottle: settingsData.pricePerBottle,
          });
        } else {
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error fetching document:', error);
      });
  }

  handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === 'checkbox') {
      this.setState({ [name]: checked });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the "Amount" field contains only numbers
    let amountPattern = /^[0-9]+$/;
    if (!amountPattern.test(this.state.amount)) {
      alert('Please enter a valid amount (numbers only)');
      return; // Prevent submitting invalid data
    }

    // Calculate the payment amount based on the user's input
    let calculatedAmount = parseFloat(this.state.amount);

    // Calculate the total price based on the amount, price per kg, and price per bottle
    let totalPrice = calculatedAmount * parseFloat(this.state.pricePerKg);
    if (this.state.own_bottle) {
      totalPrice -= calculatedAmount * parseFloat(this.state.pricePerBottle);
    }

    // Update the totalToPay in the state
    this.setState({ totalToPay: totalPrice });

    // Show the summary popup
    this.setState({ showSummary: true });
  };

  handlePayNow = async () => {
    // Calculate the payment amount based on the user's input
    let calculatedAmount = parseFloat(this.state.amount);

    // Calculate the total price based on the amount, price per kg, and price per bottle
    let totalPrice = calculatedAmount * parseFloat(this.state.pricePerKg);
    if (this.state.own_bottle) {
      totalPrice -= calculatedAmount * parseFloat(this.state.pricePerBottle);
    }

    // Create the payment link with the calculated amount and names
    let { first_name, second_name } = this.state;
    let paymentLink = `https://payme.sk/?V=1&IBAN=${this.state.iban}&AM=${totalPrice}&CC=EUR&DT=20230908&MSG=ESHOP_${first_name}_${second_name}&CN=Marcok`;

    // Add the data to Firestore with the total amount
    const db = getFirestore(firebaseApp);

    try {
      const docRef = await addDoc(collection(db, 'med'), {
        first_name: this.state.first_name,
        second_name: this.state.second_name,
        amount: parseFloat(this.state.amount),
        totalAmount: totalPrice, // Store the total amount in the database
        telephone_number: this.state.telephone_number,
        own_bottle: this.state.own_bottle,
      });

      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }

    // Open the payment link in a new tab
    window.open(paymentLink, '_blank');
  };

  handlePayLater = async () => {
    // Calculate the payment amount based on the user's input
    let calculatedAmount = parseFloat(this.state.amount);

    // Calculate the total price based on the amount, price per kg, and price per bottle
    let totalPrice = calculatedAmount * parseFloat(this.state.pricePerKg);
    if (!this.state.own_bottle) {
      totalPrice += calculatedAmount * parseFloat(this.state.pricePerBottle);
    }

    // Close the summary popup
    this.setState({ showSummary: false, orderComplete: true });

    // Clear the form after successfully adding the document
    this.setState({
      first_name: '',
      second_name: '',
      amount: '',
      telephone_number: '', // Clear telephone_number
      own_bottle: false,
      totalToPay: 0, // Reset the totalToPay
    });

    // Add the data to Firestore with the total amount
    const db = getFirestore(firebaseApp);

    try {
      const docRef = await addDoc(collection(db, 'med'), {
        first_name: this.state.first_name,
        second_name: this.state.second_name,
        amount: parseFloat(this.state.amount),
        totalAmount: totalPrice, // Store the total amount in the database
        telephone_number: this.state.telephone_number,
        own_bottle: this.state.own_bottle,
      });

      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  render() {
    return (
      <div>
        <h1>Objednávka medu</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Meno:
            <input
              type="text"
              name="first_name"
              value={this.state.first_name}
              onChange={this.handleChange}
              required // Make it a required field
            />
          </label>
          <br />
          <label>
            Priezvisko:
            <input
              type="text"
              name="second_name"
              value={this.state.second_name}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Množstvo(kg):
            <input
              type="text"
              name="amount"
              value={this.state.amount}
              onChange={this.handleChange}
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
              value={this.state.telephone_number}
              onChange={this.handleChange}
              required // Make it a required field
            />
          </label>
          <br />
          <label>
            Prinesiem vlastné fľaše(osobný odber):
            <input
              type="checkbox"
              name="own_bottle"
              checked={this.state.own_bottle}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <button type="submit">Ďalej</button>
        </form>

        {/* Summary Popup */}
        {this.state.showSummary && (
          <div className="summary-popup">
            <h2>Summary</h2>
            <p>First Name: {this.state.first_name}</p>
            <p>Second Name: {this.state.second_name}</p>
            <p>Amount: {this.state.amount}</p>
            <p>Total to Pay: {this.state.totalToPay}</p>
            <button onClick={this.handlePayNow}>Pay Now</button>
            <button onClick={this.handlePayLater}>Pay Later</button>
          </div>
        )}

        {/* Order Complete Message */}
        {this.state.orderComplete && (
          <div className="order-complete">
            <h2>Objednávka prijatá!</h2>
            <p>Zaplatiť môžete neskôr.</p>
          </div>
        )}
      </div>
    );
  }
}

export default PostData;
