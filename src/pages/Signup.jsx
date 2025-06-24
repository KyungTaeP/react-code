import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

function Signup() {
  const [form, setForm] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      alert('비밀번호는 8자리 이상 가능합니다.');
      return false;
    }

    const hasNumber = /[0-9]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecial = /[!%*#?&]/.test(password);

    if (hasNumber && !hasLetter && !hasSpecial) {
      alert('숫자만 사용할 수 없습니다. 영문자랑 특수문자(!%*#?&)를 혼합해서 사용해주세요.');
      return false;
    }
    if (hasLetter && !hasNumber && !hasSpecial) {
      alert('영문자만 사용할 수 없습니다. 숫자랑 특수문자(!%*#?&)를 혼합해서 사용해주세요.');
      return false;
    }
    if (hasSpecial && !hasNumber && !hasLetter) {
      alert('특수문자(!%*#?&)만 사용할 수 없습니다. 숫자랑 영문자를 혼합해서 사용해주세요.');
      return false;
    }

    const isValid = hasNumber && hasLetter && hasSpecial;
    if (!isValid) {
      alert('비밀번호는 숫자, 영문자, 특수문자(!%*#?&)를 모두 포함해야 합니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (!validatePassword(form.password)) return;

    try {
      await signup(form);
      alert('회원가입 성공');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('회원가입 실패');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-sm p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">이메일 (Username)</label>
            <input
              id="email"
              name="username"
              type="email"
              value={form.username}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="new-email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">이름</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            회원가입
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          이미 계정이 있으신가요?{' '}
          <a href="/" className="text-blue-600 hover:underline">로그인</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
