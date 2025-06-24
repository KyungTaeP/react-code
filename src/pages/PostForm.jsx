import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('FREE');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const post = { title, content, category };
      await createPost(post, file);
      alert('게시글이 성공적으로 작성되었습니다.');
      navigate('/posts'); // PostMain.jsx로 이동
    } catch (error) {
      console.error('작성 실패:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-black p-6 rounded shadow-lg text-white">
        <h2 className="text-xl font-bold mb-4">글쓰기</h2>

        <input
          className="w-full p-2 mb-2 bg-gray-800 border border-gray-600"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-2 mb-2 h-24 bg-gray-800 border border-gray-600"
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <select
          className="w-full p-2 mb-2 bg-gray-800 border border-gray-600"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="FREE">자유</option>
          <option value="NOTICE">공지</option>
          <option value="QNA">Q&A</option>
          <option value="ETC">기타</option>
        </select>

        <input
          type="file"
          className="mb-1"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && <p className="text-sm text-gray-400 mb-2">파일명: {file.name}</p>}

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            작성
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
