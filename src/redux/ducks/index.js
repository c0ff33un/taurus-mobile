import {combineReducers} from 'redux';
import authentication from './authentication';
import messages from './messages';
import messageLog from './messageLog';
import websockets from './websockets';
import loading from './loading';
import gameController from './gameController';


export default combineReducers({
  authentication,
  messages,
  gameController,
  loading,
  websockets,
  messageLog,
});
