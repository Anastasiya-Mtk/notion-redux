const initialState = {
  notes: [],
};

const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [action.payload, ...state.notes],
      };
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload, 
      };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };
    default:
      return state;
  }
};

export default notesReducer;
