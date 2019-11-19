import {  
  REQUEST_JWT,
  RECEIVE_JWT,
  RECEIVE_JWT_ERROR,
  LOGOUT,
  SET_FINISHED,
} from './actionTypes'
import getEnvVars from '../../environment'
import { batch } from 'react-redux'

/*
 * action creators
 */

export function setFinished(filter) {
  return { type: SET_FINISHED, payload: { filter }}
}

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
          msg = res.errors[0].message
          dispatch(receiveJWTError(msg))
        } else {
          jwt = res.data.guest.jwt
          dispatch(receiveJWT(jwt))
        }
        return res
      })
      .catch(error => {throw new Error(error)})
  }
}

export function logout() {
  return { type: LOGOUT }
}
