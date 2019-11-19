import firebase from 'react-native-firebase'

const REQUEST_FCM_TOKEN = "REQUEST_FCM_TOKEN",
      RECEIVE_FCM_TOKEN = "RECEIVE_FCM_TOKEN",
      RECEIVE_FCM_ERROR = "RECEIVE_FCM_ERROR",
      RECEIVE_FCM_MESSAGES = "RECEIVE_FCM_MESSAGES";

const initialState = {
  fcmToken: "",
  fcmError: false,
  isRequesting: false,
  enabled: false,
  messages: null,
};

export default function reducer(state=initialState, action){
  switch(action.type){
    case REQUEST_FCM_TOKEN:
      return Object.assign({},
        state,
        { isRequesting: true })
    case RECEIVE_FCM_TOKEN:
      const { fcmToken } = action.payload
      console.log(`$$$$$$$$$$$$$$$$$$$$$$$$$$
      ${fcmToken}
      $$$$$$$$$$$$$$$$$$$$$$$$$$`)
      return Object.assign({},
        state,
        { fcmToken, isRequesting: false, })
    case RECEIVE_FCM_ERROR: 
      const { fcmError } = action.payload
      return Object.assign({},
        state,
        { fcmError, isRequesting: false, })
    case RECEIVE_FCM_MESSAGES:
      const { messages } = action.payload
      return Object.assign({},
        state,
        { messages })
    default:
      return state
  }
};

function requestFcmToken(){
  return { type: REQUEST_FCM_TOKEN, payload: null }
}

export function receiveFcmToken(fcmToken){
  return { type: RECEIVE_FCM_TOKEN, payload: { fcmToken }}
}

function receiveFcmError(fcmError){
  return { type: RECEIVE_FCM_ERROR, payload: { fcmError }}
}

export function receiveMessages(messages){
  return { type: RECEIVE_FCM_MESSAGES, payload: { messages }}
}

//1 
export function checkPermission() {
  return async (dispatch) => {
    const enabled = await firebase.messaging().hasPermission()
    
    if(enabled){
      dispatch(getToken())
    }else{
      dispatch(requestPermission())
    }
  }
}

//2
export async function requestPermission() {
  return async (dispatch) => { 
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      dispatch(getToken());
    } catch (error) {
      // User has rejected permissions
      dispatch(receiveFcmError(error))
    }
  }
}

//3
export function getToken() {
  return async (dispatch, getState) => {
    const { fcmToken } = getState()
    console.log(`@@@
    No token already: ${!fcmToken}
    @@@`)
    if (!fcmToken) {
      dispatch(requestFcmToken())
      return firebase.messaging().getToken()
        .then(token => {
          console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@
          
          Token retrieved: ${token}
          
          @@@@@@@@@@@@@@@@@@@@@@@@@@@`)
          return dispatch(receiveFcmToken(token)) 
        })
        .catch(err => console.log(err))
    }
  }
}

export async function message(){
  return (dispatch, getState) => {
    dispatch(checkPermission())

  }
}
