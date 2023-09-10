import React, { Component } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
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
    };
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
    const amountPattern = /^[0-9]+$/;
    if (!amountPattern.test(this.state.amount)) {
      alert('Please enter a valid amount (numbers only)');
      return; // Prevent submitting invalid data
    }

    // Calculate the payment amount based on the user's input
    const calculatedAmount = parseFloat(this.state.amount) * 1;

    // Update the totalToPay in the state
    this.setState({ totalToPay: calculatedAmount });

    // Show the summary popup
    this.setState({ showSummary: true });
  };

  handlePayNow = async () => {
    // Calculate the payment amount based on the user's input
    const calculatedAmount = parseFloat(this.state.amount) * 1;

    // Create the payment link with the calculated amount and names
    const { first_name, second_name } = this.state;
    const paymentLink = `https://payme.sk/?V=1&IBAN=LT563250093048589019&AM=${calculatedAmount}&CC=EUR&DT=20230908&MSG=ESHOP_${first_name}_${second_name}&CN=Marcok`;

    // Add the data to Firestore
    const db = getFirestore(firebaseApp);

    try {
      const docRef = await addDoc(collection(db, 'med'), {
        first_name: this.state.first_name,
        second_name: this.state.second_name,
        amount: parseFloat(this.state.amount),
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
    // Close the summary popup
    this.setState({ showSummary: false });

    // Clear the form after successfully adding the document
    this.setState({
      first_name: '',
      second_name: '',
      amount: '',
      telephone_number: '', // Clear telephone_number
      own_bottle: false,
      totalToPay: 0, // Reset the totalToPay
    });

    // Add the data to Firestore
    const db = getFirestore(firebaseApp);

    try {
      const docRef = await addDoc(collection(db, 'med'), {
        first_name: this.state.first_name,
        second_name: this.state.second_name,
        amount: parseFloat(this.state.amount),
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
        <h1>Post data</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            First name:
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
            Second name:
            <input
              type="text"
              name="second_name"
              value={this.state.second_name}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Amount:
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
            Telephone Number:
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
            Own Bottle:
            <input
              type="checkbox"
              name="own_bottle"
              checked={this.state.own_bottle}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <button type="submit">Next</button>
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
      </div>
    );
  }
}

export default PostData;
