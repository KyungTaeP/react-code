const BASE_URL = 'https://front-mission.bigs.or.kr';

export async function login(data) {
  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('로그인 실패');
  return await res.json(); // accessToken, refreshToken 등
}
