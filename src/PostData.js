// PostData.js
import React, { Component } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseApp from './firebase';

class PostData extends Component {
  constructor() {
    super();
    this.state = {
      value1: '',
      value2: '',
      value3: '',
      ownBottle: false, // Initialize the checkbox state
    };
  }

  handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // If the input is a checkbox, update the 'ownBottle' state
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
    if (!amountPattern.test(this.state.value3)) {
      alert('Please enter a valid amount (numbers only)');
      return; // Prevent submitting invalid data
    }

    // Create a Firestore instance
    const db = getFirestore();

    // Reference the Firestore collection where you want to add the document
    const dataCollection = collection(db, 'med'); // Replace with your collection name

    // Add a new document with the values from the form, including the checkbox state
    try {
      await addDoc(dataCollection, {
        first_name: this.state.value1,
        amount: this.state.value3,
        second_name: this.state.value2,
        own_bottle: this.state.ownBottle, // Include the checkbox value
      });

      // Clear the form after successfully adding the document
      this.setState({ value1: '', value2: '', value3: '', ownBottle: false });
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
              name="value1"
              value={this.state.value1}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Second name:
            <input
              type="text"
              name="value2"
              value={this.state.value2}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Amount:
            <input
              type="text"
              name="value3"
              value={this.state.value3}
              onChange={this.handleChange}
              pattern="[0-9]+" // Use the pattern attribute for numbers only
            />
          </label>
          <br />
          <label>
            Own Bottle:
            <input
              type="checkbox"
              name="ownBottle"
              checked={this.state.ownBottle}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default PostData;
