import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, deletePost } from '../services/api';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await fetchPostById(id);
      setPost(data);
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('삭제하시겠습니까?')) {
      await deletePost(id);
      alert('삭제 완료');
      navigate('/posts');
    }
  };

  if (!post) return <div>로딩중...</div>;

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-black p-6 rounded shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
        <p className="text-sm text-gray-400 mb-2">{post.category}</p>
        <p className="mb-4">{post.content}</p>

        {post.filename && (
          <p className="text-sm text-gray-400 mb-4">첨부파일: {post.filename}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/posts/${id}/edit`)}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            수정하기
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 px-4 py-2 rounded"
          >
            삭제하기
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 px-4 py-2 rounded"
          >
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
