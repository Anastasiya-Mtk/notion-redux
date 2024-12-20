import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 

const NotFoundPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.currentUserId !== null); 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Страница не найдена</h1>
      <p className="mb-6">Извините, но запрашиваемая страница не существует.</p>
      {isAuthenticated ? (
        <button
          onClick={() => navigate('/home')}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          На главную страницу
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Вход
        </button>
      )}
    </div>
  );
};

export default NotFoundPage;