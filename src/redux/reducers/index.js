import { combineReducers } from 'redux';
import session from './session'
import { memes, memesByFilter, selectedFilter, memePostId }  from './memes'
import { message } from './messages'

export default combineReducers(
  { session,
    message});