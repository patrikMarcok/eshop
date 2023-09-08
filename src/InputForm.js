import React, { Component } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Import addDoc

class InputForm extends Component {
  constructor() {
    super();
    this.state = {
      first_name: '',
      amount: '',
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    // Create a Firestore instance
    const db = getFirestore();

    // Reference the Firestore collection where you want to add the document
    const dataCollection = collection(db, 'med'); // Replace with your collection name

    // Add a new document with the values from the form
    try {
      await addDoc(dataCollection, {
        first_name: this.state.value1,
        amount: this.state.value2,
      });

      // Clear the form after successfully adding the document
      this.setState({ value1: '', value2: '' });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  render() {
    return (
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
          Amount:
          <input
            type="text"
            name="value2"
            value={this.state.value2}
            onChange={this.handleChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default InputForm;
