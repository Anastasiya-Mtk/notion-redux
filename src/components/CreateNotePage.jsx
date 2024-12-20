import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { addNote } from '../actions/noteActions'; 
import { createNote } from '../api/noteApi'; 

const CreateNotePage = ({ currentUserId }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const handleAddNote = async (e) => {
    e.preventDefault();
    const newNote = {
      title,
      body,
      authorId: currentUserId,
      createdAt: new Date().toISOString(),
    };

    try {
      const savedNote = await createNote(newNote); 
      dispatch(addNote(savedNote)); 
      navigate(`/note/${savedNote.id}`); 
    } catch (error) {
      console.error('Ошибка при добавлении заметки:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Создать заметку</h1>
      <form onSubmit={handleAddNote} className="mb-4">
        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 mr-2 w-full"
        />
        <textarea
          placeholder="Тело заметки"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Добавить заметку
        </button>
      </form>
      <button
        onClick={() => navigate('/notes')} 
        className="mt-4 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
      >
        Назад к заметкам
      </button>
    </div>
  );
};

CreateNotePage.propTypes = {
  currentUserId: PropTypes.number.isRequired,
};

export default CreateNotePage;