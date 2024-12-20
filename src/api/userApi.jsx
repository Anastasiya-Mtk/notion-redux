const API_URL = 'http://localhost:5001/users';

export const fetchUsersByEmail = async (email) => {
  const response = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error('Ошибка при проверке email');
  }
  return await response.json();
};

export const registerUser = async (newUser) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });

  if (!response.ok) {
    throw new Error('Ошибка регистрации пользователя');
  }
  return await response.json();
};

export const fetchUsers = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Ошибка при получении данных пользователей');
  }
  return await response.json();
};