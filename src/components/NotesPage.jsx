import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setNotes, deleteNote } from '../actions/noteActions';
import { fetchNotes, deleteNote as deleteNoteApi } from '../api/noteApi';

const NotesPage = ({ currentUserId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes);

  useEffect(() => {
    const fetchNotesAsync = async () => {
      try {
        const data = await fetchNotes();
        const userNotes = data.filter(note => note.authorId === currentUserId);
        const sortedNotes = userNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        dispatch(setNotes(sortedNotes));
      } catch (error) {
        console.error('Ошибка при получении заметок:', error);
      }
    };

    fetchNotesAsync();
  }, [currentUserId, dispatch]);

  const handleDeleteNote = async (id) => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить эту заметку?');
    if (!confirmDelete) return;

    try {
      await deleteNoteApi(id);
      dispatch(deleteNote(id));
    } catch (error) {
      console.error('Ошибка при удалении заметки:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <header className="bg-gray-800 p-4 text-white flex justify-between items-center w-full mb-4">
        <nav>
          <button 
            onClick={() => navigate('/home')}
            className={`px-4 py-2 ${window.location.pathname === '/home' ? 'bg-blue-500' : ''} rounded`}
          >
            About
          </button>
          <button 
            onClick={() => navigate('/notes')}
            className={`px-4 py-2 ${window.location.pathname === '/notes' ? 'bg-blue-500' : ''} rounded`}
          >
            Notes
          </button>
        </nav>
      </header>

      <h1 className="text-3xl font-bold mb-4">Заметки</h1>

      <button
        onClick={() => navigate('/create-note')}
        className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 mb-4 text-sm mx-auto"
      >
        Создать заметку
      </button>

      <div className="grid grid-cols-1 gap-4 w-full max-w-2xl mx-auto">
        {notes.length > 0 ? notes.map(note => (
          <div
            key={note.id}
            className="bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => navigate(`/note/${note.id}`)}
          >
            <h2 className="text-xl font-semibold mb-2 break-words">{note.title}</h2>
            <small className="text-gray-500">{new Date(note.createdAt).toLocaleString()}</small>
            <div className="flex justify-between mt-4">
              <span
                onClick={(e) => { e.stopPropagation(); navigate(`/edit-note/${note.id}`); }}
                className="text-blue-500 cursor-pointer"
                title="Редактировать"
              >
                ✏️
              </span>
              <span
                onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                className="text-red-500 cursor-pointer"
                title="Удалить"
              >
                🗑️
              </span>
            </div>
          </div>
        )) : (
          <p className="text-gray-500">Заметок не найдено.</p>
        )}
      </div>

      <button
        onClick={() => navigate('/home')}
        className="bg-gradient-to-r from-green-600 to-green-400 text-white py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 text-sm mx-auto mt-6"
      >
        Вернуться на главную страницу
      </button>
    </div>
  );
};

NotesPage.propTypes = {
  currentUserId: PropTypes.number.isRequired, 
};

export default NotesPage;