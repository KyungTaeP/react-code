import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, deletePost } from '../services/api';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPostById(id).then(setPost).catch(() => alert('조회 실패'));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await deletePost(id);
    alert('삭제되었습니다');
    navigate('/');
  };

  if (!post) return <div>로딩중...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{post.title}</h2>
      <p className="text-sm text-gray-600">{post.boardCategory}</p>
      <p className="mt-4">{post.content}</p>
      {post.imageUrl && <img src={post.imageUrl} alt="첨부이미지" className="mt-4" />}
      <button onClick={handleDelete} className="mt-6 px-4 py-2 bg-red-500 text-white rounded">삭제하기</button>
    </div>
  );
};

export default PostDetail;
