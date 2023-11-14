import { combineReducers } from 'redux';
import userReducer from './user/reducers';

const rootReducer = combineReducers({
  user: userReducer,
  // Thêm reducers khác nếu có
});

export default rootReducer;