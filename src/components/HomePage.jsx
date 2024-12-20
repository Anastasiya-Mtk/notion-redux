import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '../actions/userActions';
import { fetchUsers as fetchUsersApi } from '../api/userApi'; 

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const currentUserId = useSelector((state) => state.user.currentUserId);
  const users = useSelector((state) => state.user.users);

  const currentUser = users ? users.find(user => user.id === currentUserId) : null;

  const registrationDate = currentUser ? currentUser.createdAt : localStorage.getItem('registrationDate');
  const email = currentUser ? currentUser.email : localStorage.getItem('currentUserEmail') || '';

  const displayRegistrationDate = registrationDate ? new Date(registrationDate).toLocaleString() : '';

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsersApi(); 
        dispatch(setUsers(usersData));

        if (usersData) {
          const currentUser = usersData.find(user => user.id === currentUserId);
          if (currentUser) {
            localStorage.setItem('registrationDate', currentUser.createdAt);
            localStorage.setItem('currentUserEmail', currentUser.email);
          }
        }
      } catch (error) {
        console.error('Ошибка при получении данных пользователей:', error);
      }
    };

    loadUsers();
  }, [dispatch, currentUserId]); 

  const handleLogout = () => {
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('registrationDate');
    navigate('/login'); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-gray-800 p-4 text-white flex justify-between items-center">
        <nav>
          <button 
            onClick={() => navigate('/home')}
            className={`px-4 py-2 ${location.pathname === '/home' ? 'bg-blue-500' : ''} rounded`}
          >
            About
          </button>
          <button 
            onClick={() => navigate('/notes')}
            className={`px-4 py-2 ${location.pathname === '/notes' ? 'bg-blue-500' : ''} rounded`}
          >
            Notes
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="bg-red-500 py-2 px-4 rounded hover:bg-red-600"
        >
          Log out
        </button>
      </header>
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Добро пожаловать на главную страницу!</h1>
        {displayRegistrationDate && (
          <p className="text-lg mb-4">
            Дата регистрации: {displayRegistrationDate}
          </p>
        )}
        {email && (
          <p className="text-lg mb-4">Email: {email}</p>
        )}
        <button
          onClick={() => navigate('/notes')}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Перейти к Заметкам
        </button>
      </div>
    </div>
  );
};

export default HomePage;