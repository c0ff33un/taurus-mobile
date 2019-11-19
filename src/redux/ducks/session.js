import getEnvVars from 'taurusMobile/environment'
import { persistReducer } from 'redux-persist'
import { finishLoading } from './loading'
import AsyncStorage from '@react-native-community/async-storage'

const REQUEST_JWT = 'REQUEST_JWT'
const RECEIVE_JWT = 'RECEIVE_JWT'
const VALIDATE_EMAIL = 'VALIDATE_EMAIL'
const RECEIVE_JWT_ERROR = 'RECEIVE_JWT_ERROR'
const LOGOUT = 'LOGOUT'

function requestJWT() {
  return { type: REQUEST_JWT }
}

function receiveJWT(jwt) {
  return { type: RECEIVE_JWT, payload: { jwt } }
}

function receiveJWTError(message) {
  return { type: RECEIVE_JWT_ERROR, payload: {message} }
}

export function loginWithJWT(jwt){
  return (dispatch) => {
    if(jwt) return dispatch(receiveJWT(jwt))
    else return dispatch(receiveJWTError())
  }
}

export function login(email, password) {
  return dispatch => {
    dispatch(requestJWT())
    const { apiUrl } = getEnvVars
    
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        query: `mutation {login(user:{email:"${email}" password: "${password}"}){user{id handle email guest} jwt}}`
      })
    }
    return fetch(`${apiUrl}`, options)
      .then(res => res.json())
      .then(res => {
        console.log(res)
        if(!res.data){
          msg = res.errors[0].message
          dispatch(receiveJWTError(msg))
        } else {
          console.log(res)
          jwt = res.data.login.jwt
          dispatch(receiveJWT(jwt))
          
        }
        return res
      })
      .catch(error => {throw new Error(error)})
  }
}

export function guestLogin() {
  return (dispatch) => {
    dispatch(requestJWT())
    const { apiUrl } = getEnvVars
    console.log('here', apiUrl)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        query: `mutation {guest{user{id handle email guest} jwt}}`
      })
    }
    return fetch(apiUrl, options)
      .then(res => res.json())
      .then(res => {
        console.log(res)
        if(!res.data){
          const msg = res.errors[0].message
          dispatch(receiveJWTError(msg))
        } else {
          const jwt = res.data.guest.jwt
          dispatch(finishLoading())
          dispatch(receiveJWT(jwt))
        }
        return res
      })
      .catch(error => {
        dispatch(finishLoading())
        throw new Error(error)
      })
  }
}

export function logout() {
  return { type: LOGOUT }
}

function session(
  state = {
    jwt: null,
    isLoggingIn: false,
    needsValidation: false,
    loginError: false,
    message: ""
  }, 
  action
) {
  switch (action.type) {
    case REQUEST_JWT:
      return Object.assign({},
        state,
        { isLoggingIn: true })
    case RECEIVE_JWT:
      const { jwt } = action.payload
      console.log(jwt)
      return Object.assign({},
        state,
        {jwt, isLoggingIn: false})
    case RECEIVE_JWT_ERROR: 
      const { message } = action.payload
      return { isLoggingIn: false, loginError: true, message }
    case VALIDATE_EMAIL:
      return Object.assign({}, 
        state,
        { needsValidation: true, isLoggingIn: false})
    case LOGOUT:
      return { jwt: null, isLoggingIn: false };
    default:
      return state;
  }
}


const persistConfig = {
  key: 'session',
  storage: AsyncStorage,
  blacklist: ['isLoggingIn'],
}

export default persistReducer(persistConfig, session)
