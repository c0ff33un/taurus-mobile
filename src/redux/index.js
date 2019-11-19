import { createStore, applyMiddleware } from 'redux'
import thunkMiddleWare from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage'
import wsMiddleware from './middleware/websocket'
import rootReducer from './ducks'

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: ['websockets', 'gameController']
}

const loggerMiddleware = createLogger()
const persistedReducer = persistReducer(persistConfig, rootReducer)
const log = process.env.NODE_ENV === 'development'

const middleware = [
  thunkMiddleware,
  wsMiddleware,
  log && loggerMiddleware
]

export default function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    // applyMiddleware(thunkMiddleWare),
    applyMiddleware(...middleware)
  )
}
