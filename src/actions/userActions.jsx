export const setCurrentUserId = (userId) => ({
    type: 'SET_CURRENT_USER_ID',
    payload: userId,
  });
  
  export const setUsers = (users) => ({
    type: 'SET_USERS',
    payload: users,
  });