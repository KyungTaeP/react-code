import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchPosts,
  fetchCategoryMap,
  deletePost,
} from '../services/api';
import dayjs from 'dayjs';

// ✅ 초성 추출 함수
const getInitials = (text) => {
  const INITIAL_SOUND = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
    'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ',
    'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  ];

  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 0xac00 && code <= 0xd7a3) {
        const uniVal = code - 0xac00;
        const cho = Math.floor(uniVal / 588);
        return INITIAL_SOUND[cho];
      }
      return char;
    })
    .join('');
};

const PostMain = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [page, setPage] = useState(1);
  const postsPerPage = 10;
  const [searchKeyword, setSearchKeyword] = useState('');
  const [user, setUser] = useState({ username: '', name: '' });
  const [categoryMap, setCategoryMap] = useState({});
  const navigate = useNavigate();

  const mapCategory = (category) => {
    return categoryMap[category?.toUpperCase()] || category;
  };

  const formatDate = (iso) =>
    dayjs(iso).format('YYYY-MM-DD HH:mm:ss');

  const loadPosts = async () => {
    try {
      const res = await fetchPosts(1, 10000); // 전체 게시글 불러오기
      setAllPosts(res.content);
      setFilteredPosts(res.content);
    } catch (err) {
      console.error(err);
      alert('게시글을 불러오지 못했습니다');
    }
  };

  const handleSearch = () => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      setFilteredPosts(allPosts);
      return;
    }

    const keywordInitials = getInitials(keyword);
    const result = allPosts.filter((post) => {
      const title = post.title.toLowerCase();
      const titleInitials = getInitials(title);
      return (
        title.includes(keyword) || titleInitials.includes(keywordInitials)
      );
    });

    setFilteredPosts(result);
    setPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deletePost(id);
      alert('삭제되었습니다');
      await loadPosts();
    } catch (err) {
      console.error(err);
      alert('삭제 실패');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    loadPosts();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const loadCategoryMap = async () => {
      try {
        const res = await fetchCategoryMap();
        setCategoryMap(res);
      } catch (err) {
        console.error('카테고리 조회 실패:', err);
      }
    };
    loadCategoryMap();
  }, []);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  return (
    <div className="min-h-screen w-screen bg-gray-100 text-white px-4 flex justify-center">
      <div className="w-full max-w-[1920px] min-h-screen mx-auto bg-white text-black p-6">
        <header className="border border-gray-300 p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            안녕하세요, Email:{' '}
            <span className="font-medium">{user.username}</span>, 이름:{' '}
            <span className="font-medium">{user.name}</span> 님
          </div>
          <button
            onClick={() => navigate('/posts/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            글쓰기
          </button>
        </header>

        <section className="mt-5 border border-gray-300 p-4 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center text-gray-700 table-fixed">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="py-2 px-4 w-[10%]">순서</th>
                  <th className="py-2 px-4 w-[20%]">카테고리</th>
                  <th className="py-2 px-4 w-[40%]">제목</th>
                  <th className="py-2 px-4 w-[20%]">날짜</th>
                  <th className="py-2 px-4 w-[10%]">관리</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((post, idx) => (
                  <tr key={post.id} className="border-b">
                    <td className="py-2 px-4">
                      {(page - 1) * postsPerPage + idx + 1}
                    </td>
                    <td className="py-2 px-4">{mapCategory(post.category)}</td>
                    <td className="py-2 px-4 text-left truncate">
                      <Link
                        to={`/posts/${post.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-2 px-4 text-left">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="py-2 px-4 flex justify-center gap-2">
                      <Link
                        to={`/posts/${post.id}/edit`}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    page === i + 1
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-6 flex justify-center items-center gap-2">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="조회할 제목을 입력하세요."
            className="border border-gray-300 rounded px-3 py-1 w-64"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            조회
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PostMain;
