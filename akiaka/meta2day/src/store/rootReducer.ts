import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    notification: notificationReducer,
});

export default rootReducer;