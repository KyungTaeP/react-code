// App.jsx
import React, { useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostMain from './pages/PostMain';
import PostForm from './pages/PostForm';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import PostEdit from './pages/PostEdit';

function App() {
  const { setAuth } = useContext(AuthContext);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      setAuth({ accessToken, refreshToken });
    }
  }, [setAuth]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/posts" element={<PostMain />} />
      <Route path="/posts/new" element={<PostForm />} />
      <Route path="/postslist" element={<PostList />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/posts/:id/edit" element={<PostEdit />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;