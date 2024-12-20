import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setNotes } from '../actions/noteActions'; 
import { fetchNoteById } from '../api/noteApi'; 

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes); 
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await fetchNoteById(id); 
        setNote(data);
        const currentNotes = [...notes];
        if (!currentNotes.find(n => n.id === data.id)) {
          dispatch(setNotes([...currentNotes, data])); 
        }
      } catch (error) {
        if (error.message === 'Ошибка при получении заметки') {
          navigate('/404'); 
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, dispatch, notes, navigate]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-2 break-words">{note.title}</h1>
        <p className="text-gray-700 mb-4 break-words">{note.body}</p>
        <small className="text-gray-500">{new Date(note.createdAt).toLocaleString()}</small>
        
        <div className="mt-4">
          <button
            onClick={() => navigate('/notes')}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Вернуться к заметкам
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;