import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUserId, setUsers } from './actions/userActions';
import { addNote } from './actions/noteActions';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import NotesPage from './components/NotesPage';
import CreateNotePage from './components/CreateNotePage';
import EditNotePage from './components/EditNotePage';
import NoteDetailPage from './components/NoteDetailPage';
import NotFoundPage from './components/NotFoundPage';
import { fetchUsers } from './api/userApi'; 
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.user.currentUserId); 
  const notes = useSelector((state) => state.notes.notes);

  useEffect(() => {
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    if (currentUserEmail) {
      const fetchUserId = async () => {
        try {
          const users = await fetchUsers(); 
          const user = users.find(u => u.email === currentUserEmail);
          if (user) {
            dispatch(setCurrentUserId(Number(user.id))); 
            dispatch(setUsers(users)); 
          }
        } catch (error) {
          console.error('Ошибка при загрузке пользователя:', error);
        }
      };
      fetchUserId();
    }
  }, [dispatch]);

  const handleLogin = (userId) => {
    dispatch(setCurrentUserId(Number(userId))); 
  };

  const handleAddNote = (newNote) => {
    dispatch(addNote(newNote)); 
  };

  const isAuthenticated = currentUserId !== null;

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Outlet />,
      children: [
        {
          index: true,
          element: <Navigate to="/login" />,
        },
        {
          path: 'register',
          element: <RegistrationPage />,
        },
        {
          path: 'login',
          element: <LoginPage onLogin={handleLogin} />,
        },
        {
          path: 'home',
          element: <HomePage />,
        },
        {
          path: 'notes',
          element: currentUserId ? <NotesPage currentUserId={Number(currentUserId)} notes={notes} /> : <Navigate to="/login" />,
        },
        {
          path: 'create-note',
          element: currentUserId ? <CreateNotePage currentUserId={Number(currentUserId)} onAddNote={handleAddNote} /> : <Navigate to="/login" />,
        },
        {
          path: 'edit-note/:id',
          element: currentUserId ? <EditNotePage /> : <Navigate to="/login" />,
        },
        {
          path: 'note/:id',
          element: <NoteDetailPage />,
        },
        {
          path: '*',
          element: <NotFoundPage isAuthenticated={isAuthenticated} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;