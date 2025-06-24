const BASE_URL = '/api'; // ✅ 프록시 사용

// 로그인
export async function login(data) {
  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('로그인 실패:', err);
    throw new Error(err.message || '로그인 실패');
  }

  const responseData = await res.json();
  return responseData;
}

// 회원가입
export async function signup(data) {
  console.log('회원가입 요청 데이터:', data);

  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();
  console.log('회원가입 응답 데이터:', responseData);

  if (!res.ok) {
    throw new Error(responseData.message || '회원가입 실패');
  }

  return responseData;
}

  // 리프레시 토큰 요청
export async function refreshAccessToken(refreshToken) {
  console.log('리프레시 요청 토큰:', refreshToken);

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const responseData = await res.json();
  console.log('리프레시 응답 데이터:', responseData);

  if (!res.ok) {
    throw new Error(responseData.message || '토큰 갱신 실패');
  }

  return responseData;
}

  // 토큰이 만료되었을 경우 자동으로 리프레시 후 재시도
export async function fetchWithAuth(url, options = {}, retry = true) {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 401 && retry && refreshToken) {
    try {
      const newToken = await refreshAccessToken(refreshToken);
      localStorage.setItem('accessToken', newToken.accessToken);

      // 🔁 토큰 재발급 후 재요청
      return await fetchWithAuth(url, options, false);
    } catch (err) {
      console.error('토큰 갱신 실패:', err);
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('인증 만료됨, 다시 로그인하세요');
    }
  }

  return res;
}

// 게시글 목록 조회 API (토큰 자동 재발급 포함)
export async function fetchPosts(page, size) {
  const res = await fetchWithAuth(`${BASE_URL}/boards?page=${page - 1}&size=${size}`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || '게시글 목록 조회 실패');
  return data;
}

// 게시글 카데고리 API
export async function fetchCategoryMap() {
  const res = await fetchWithAuth('/api/boards/categories');

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || '카테고리 목록 조회 실패');
  return data; // { NOTICE: '공지', FREE: '자유', QNA: 'Q&A', ETC: '기타' }
}

// 게시글 생성 API (form-data 전송)
export async function createPost(post, file) {
  const accessToken = localStorage.getItem('accessToken');

  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify(post)], { type: 'application/json' }));
  if (file) formData.append('file', file);

  const res = await fetch(`${BASE_URL}/boards`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`, // formData는 Content-Type 지정 ❌fetchPostById
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || '게시글 작성 실패');
  return data;
}

// 게시글 삭제 API
export async function deletePost(postId) {
  const accessToken = localStorage.getItem('accessToken');

  const res = await fetch(`${BASE_URL}/boards/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || '게시글 삭제 실패');
  }

  return true;
}

// 게시글 상세 조회 API
export async function fetchPostById(postId) {
  const res = await fetchWithAuth(`${BASE_URL}/boards/${postId}`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || '게시글 조회 실패');
  return data;
}

// 게시글 수정 API
export async function updatePost(id, formData) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`/api/boards/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`게시글 수정 실패: ${errorText}`);
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }

  return {}; // 빈 객체라도 반환하여 이후 코드 오류 방지
}

