import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';
import sseReducer from './slices/sseSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    notification: notificationReducer,
    sse: sseReducer,
});

export default rootReducer;