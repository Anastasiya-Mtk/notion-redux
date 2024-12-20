import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import notesReducer from './reducers/notesReducer';

const rootReducer = combineReducers({
  user: userReducer,
  notes: notesReducer,
});

// Настройка для поддержки Redux DevTools
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
);

export default store;
