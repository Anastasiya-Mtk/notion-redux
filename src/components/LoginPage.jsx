import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentUserId } from '../actions/userActions'; 
import { fetchUsers } from '../api/userApi'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  useEffect(() => {
    const currentUserEmail = localStorage.getItem('currentUserEmail'); 
    if (currentUserEmail) {
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const users = await fetchUsers(); 
      const user = users.find(u => u.email === email);

      if (user) {
        if (user.password === password) {
          localStorage.setItem('currentUserEmail', user.email); 
          dispatch(setCurrentUserId(user.id)); 
          navigate('/home');
        } else {
          setLoginError('Неверный пароль.');
        }
      } else {
        setLoginError('Пользователь не найден. Проверьте email.');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setLoginError('Ошибка сети. Проверьте подключение.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Вход</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Войти
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm">Нет аккаунта? <button onClick={() => navigate('/register')} className="text-blue-500 hover:underline">Зарегистрироваться</button></p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;