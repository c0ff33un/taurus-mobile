import {combineReducers} from 'redux';
import session from './session';
import messages from './messages';
import messageLog from './messageLog';
import websockets from './websockets';
import loading from './loading';
import gameController from './gameController';


export default combineReducers({
  session,
  messages,
  gameController,
  loading,
  websockets,
  messageLog,
});
