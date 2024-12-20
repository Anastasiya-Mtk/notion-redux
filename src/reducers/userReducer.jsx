const initialState = {
    currentUserId: null,
    users: [],
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_CURRENT_USER_ID':
        return {
          ...state,
          currentUserId: action.payload,
        };
      case 'SET_USERS':
        return {
          ...state,
          users: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;