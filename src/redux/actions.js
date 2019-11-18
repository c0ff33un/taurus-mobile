import {  
  SET_MEME,
  SET_MEMES,
  SET_UPLOAD_MEME,
  UPLOADING_MEME,
  SET_MEME_FILTER,
  MEME_FILTERS,
  REQUEST_MEMES,
  INVALIDATE_MEMES,
  RECEIVE_MEMES,
  RECEIVE_FILTERED_MEMES,
  RECEIVE_MEMES_ERROR,
  INCREASE_MEMES_PAGE,
  REQUEST_JWT,
  RECEIVE_JWT,
  RECEIVE_JWT_ERROR,
  LOGOUT,
  SET_FINISHED,
  RECEIVE_MEME
} from './actionTypes'
import getEnvVars from '../../environment'
import { batch } from 'react-redux'

/*
 * action creators
 */

export function setUploadMeme(image) {
  return { type: SET_UPLOAD_MEME, image }
}

export function toggleUploadingMeme() {
  return { type: UPLOADING_MEME }
}

export function setMemeFilter(filter) {
  return { type: SET_MEME_FILTER, payload: {filter} }
}

export function invalidateMemes(filter) {
  return { type: INVALIDATE_MEMES, payload: {filter} }
}

export function requestMemes(filter) {
  return { type: REQUEST_MEMES, payload: {filter} }
}

export function requestMeme(id){
  return { type: REQUEST_MEME, paylod: { id }}
}

function receiveMemesError() {
  return { type: RECEIVE_MEMES_ERROR }
}

export function receiveMemes(json) {
  return { type: RECEIVE_MEMES, payload: { json } }
}

export function receiveMeme(json){
  return {type: RECEIVE_MEME, payload: { json }}
}

export function receiveFilteredMemes(filter, ids) {
  return { type: RECEIVE_FILTERED_MEMES, 
    payload: {
      filter,
      ids,
      receivedAt: Date.now()
    }
  }
}

export function increaseMemesPage(filter) {
  return {type: INCREASE_MEMES_PAGE, payload: {filter} }
}

function receiveComments(filter, json) {
  return { type: RECEIVE_MEMES, 
    payload: {
      filter,
      comments: json.map(response => { return response.thumbnail }),
      receivedAt: Date.now()
    } 
  }
}

export function setFinished(filter) {
  return { type: SET_FINISHED, payload: { filter }}
}

export function fetchMemes(filter) {
  return (dispatch, getState) => {
    
    batch(() => {
      dispatch(requestMemes(filter))
      dispatch(increaseMemesPage(filter))
    }) 

    const { page, allIds } = getState().memesByFilter[filter]
    const { apiUrl } = getEnvVars
    console.log('fetchMemesPage:' + page)
    console.log('total by now' + allIds.length)
    const size = 18
    const url = `${apiUrl}/memes/${filter}?page=${page-1}&per_page=${size}`


    
    return fetch(url)
    .then(response => response.json())
    .then(json => {
      ids = json.map(meme =>  meme.id)
      finished = ids.length === 0

      batch(() => {
        dispatch(receiveMemes(json))
        dispatch(receiveFilteredMemes(filter, ids))

        if (finished)
          dispatch(setFinished(filter))

      }) 
      
      console.log('results')
      const { page, allIds } = getState().memesByFilter[filter]
      const { apiUrl } = getEnvVars
      console.log('fetchMemesPage:' + page)
      console.log('total by now' + allIds.length)
      console.log('Finished loading images')
      return json
    })
    .catch( error => {
      console.log('Infinite Scroll error', error)
      dispatch(receiveMemesError(filter))
      return error;
    });
  }
}

export function setMeme(id){
  return { type: SET_MEME, payload: { id } }
}

export function fetchMeme() {
  return (dispatch, getState) => {
    const { apiUrl } = getEnvVars

    const url = `http://${apiUrl}/memes/${getState().memePostId}`
    const options = {
      method: "GET",
      headers: {
        "Authorization": `${getState().jwt}`,
        "Accept": "application/json"
      },
    }

    return fetch(url, options)
    .then(response => response.json())
    .then(json => {
      console.log('fetchMeme' + json )
      dispatch(receiveMeme(json))
      console.log('Finished fetching meme')
      return json
    })
    .catch( error => {
      console.log('Problem fetching meme', error)
      return error;
    });
  }
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

export function fetchComments(id) {
  return (dispatch, getState) => {
    dispatch(requestComments(id))
    const { page } = getState().commentsById[id]
    const { apiUrl } = getEnvVars
    const url = `${apiUrl}/memes/${id}/comments`
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        ids = json.map(meme => {return meme.id})
        dispatch(increaseMemesPage(filter))
        dispatch(receiveMemes(json))
        dispatch(receiveFilteredMemes(filter, ids))
        return json
      })
      .catch(error => {
        console.log("fetchMemes error")
        console.log(error)
        dispatch(receiveMemesError())
        return error;
      })
  }
}
