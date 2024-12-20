import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setNotes, updateNote as updateNoteAction } from '../actions/noteActions';
import { fetchNotes as fetchNotesApi, updateNote as updateNoteApi } from '../api/noteApi'; 

const EditNotePage = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes) || [];
  const navigate = useNavigate();

  const note = notes.find((note) => note.id === id);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await fetchNotesApi();
        dispatch(setNotes(data.notes));
      } catch (error) {
        console.error('Ошибка при получении заметок:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!notes.length) {
      loadNotes();
    } else {
      setLoading(false);
    }
  }, [dispatch, notes.length]);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBody(note.body);
    }
  }, [note]);

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    const updatedNote = {
      ...note,
      title,
      body,
    };

    try {
      const savedNote = await updateNoteApi(id, updatedNote); 
      dispatch(updateNoteAction(savedNote));
      navigate('/notes');
    } catch (error) {
      console.error('Ошибка при обновлении заметки:', error);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!note) {
    return <div>Заметка не найдена</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Редактировать заметку</h1>

      <form onSubmit={handleUpdateNote} className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Тело заметки"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className="border border-gray-300 p-2 w-full h-40 resize-none rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Обновить заметку
        </button>
      </form>

      <h2 className="text-xl font-bold mt-6 mb-2">Тело заметки:</h2>
      <pre className="border border-gray-300 p-4 w-full max-w-lg bg-white rounded whitespace-pre-wrap break-words">
        {body}
      </pre>
    </div>
  );
};

export default EditNotePage;