import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/api';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ 로그인 상태일 경우 자동으로 /posts로 리디렉션
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      navigate('/posts');
    }
  }, []);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await login(form);

      // 이메일에 따라 name 값 고정
      const userName = form.username === 'developer@bigs.or.kr' ? '개발자' : res.name;

      // ✅ accessToken, refreshToken 저장
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('userData', JSON.stringify({ username: form.username, name: userName }));

      setAuth({ accessToken: res.accessToken, refreshToken: res.refreshToken });
      navigate('/posts');
    } catch (err) {
      console.error(err);
      alert('로그인 실패');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-black mb-6">로그인</h2>
        {/* autoComplete="off" */}
        <form onSubmit={handleSubmit} className="space-y-5" >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="username"
              type="email"
              autoComplete="new-email"
              value={form.username}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <a href="#" className="text-blue-500 hover:underline">
              비밀번호를 잊으셨나요?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-2 rounded-md hover:bg-gray-800 transition"
          >
            로그인
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-600">
          계정이 없으신가요?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
