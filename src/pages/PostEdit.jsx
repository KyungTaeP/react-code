import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, updatePost, fetchCategoryMap } from '../services/api';

const PostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [file, setFile] = useState(null);
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPostById(id);
        setForm({
          title: data.title,
          content: data.content,
          category: data.category,
        });
      } catch (err) {
        console.error('게시글 로딩 실패:', err);
        alert('게시글을 불러올 수 없습니다.');
        navigate('/');
      }
    };

    const loadCategories = async () => {
      try {
        const map = await fetchCategoryMap();
        setCategoryMap(map);
      } catch (err) {
        console.error('카테고리 불러오기 실패:', err);
      }
    };

    loadPost();
    loadCategories();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      'request',
      new Blob(
        [
          JSON.stringify({
            title: form.title,
            content: form.content,
            category: form.category,
          }),
        ],
        { type: 'application/json' }
      )
    );

    if (file) {
      formData.append('file', file);
    }

    try {
      await updatePost(id, formData);
      alert('수정 완료');
      navigate('/posts'); // ✅ 수정 완료 후 목록으로 이동
    } catch (err) {
      console.error('수정 실패:', err);
      alert('수정에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-xl bg-gray-500 p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">게시글 수정</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-medium text-gray-700">카테고리</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border p-2 rounded bg-white text-black"
              required
            >
              <option value="">선택</option>
              {Object.entries(categoryMap).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">제목</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">내용</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full border p-2 rounded min-h-[150px]"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">파일 (선택)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              뒤로가기
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEdit;
