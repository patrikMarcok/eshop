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
        amount: this.state.value3,
        second_name: this.state.value2
      });

      // Clear the form after successfully adding the document
      this.setState({ value1: '', value2: '', value3: ''});
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
