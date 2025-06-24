// PostForm.jsx
import React, { useState } from 'react';
import { createPost } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PostForm = () => {
  const [form, setForm] = useState({ title: '', content: '', category: 'NOTICE' });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createPost(form, file);
      alert('글이 작성되었습니다.');
      navigate('/posts');
    } catch (err) {
      console.error('작성 실패:', err);
      alert('작성 실패');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">글쓰기</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="제목" value={form.title} onChange={handleChange} className="w-full border p-2" required />
        <textarea name="content" placeholder="내용" value={form.content} onChange={handleChange} className="w-full border p-2" required />
        <select name="category" value={form.category} onChange={handleChange} className="w-full border p-2">
          <option value="NOTICE">공지</option>
          <option value="FREE">자유</option>
          <option value="QNA">Q&A</option>
          <option value="ETC">기타</option>
        </select>
        <input type="file" onChange={handleFile} />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">작성</button>
      </form>
    </div>
  );
};

export default PostForm;
