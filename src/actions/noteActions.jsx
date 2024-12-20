export const setNotes = (notes) => ({
  type: 'SET_NOTES',
  payload: notes,
});

export const deleteNote = (id) => ({
  type: 'DELETE_NOTE',
  payload: id,
});

export const addNote = (note) => ({
  type: 'ADD_NOTE',
  payload: note,
});

export const updateNote = (note) => ({
  type: 'UPDATE_NOTE',
  payload: note,
});