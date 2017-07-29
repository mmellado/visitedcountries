import { combineReducers } from 'redux';

// Import your reducers here
import navigation from './navigation';
import users from './users';

const reducer = combineReducers({
  // Add your reducers to the list
  navigation,
  users,
});

export default reducer;