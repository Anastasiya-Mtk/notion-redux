const API_URL = 'http://localhost:5001/notes';

export const fetchNotes = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Ошибка при получении заметок');
  }
  return await response.json();
};

export const fetchNoteById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Ошибка при получении заметки');
  }
  return await response.json();
};

export const createNote = async (note) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error('Ошибка при добавлении заметки');
  }
  return await response.json();
};

export const updateNote = async (id, note) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error('Ошибка при обновлении заметки');
  }
  return await response.json();
};

export const deleteNote = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Ошибка при удалении заметки');
  }
  return await response.json();
};