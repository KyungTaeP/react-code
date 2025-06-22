import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
// import Signup from './pages/Signup';
// import PostList from './pages/PostList';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/signup" element={<Signup />} /> */}
      {/* <Route path="/posts" element={<PostList />} /> */}
    </Routes>
  );
}

export default App;
