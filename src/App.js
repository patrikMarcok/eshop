import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GetData from './GetData';
import PostData from './PostData';
import Navigation from './Navigation';
import CompletedData from './History';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation /> {/* Include the Navigation component */}
        <div className="content"></div>
      <Routes>
        <Route path="/" element={<GetData />} />
        <Route path="/post" element={<PostData />} />
        <Route path="/history" element={<CompletedData />} />
        
        
      </Routes>
      </div>
      
    </Router>
  );
}

export default App;

