import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import AsyncStorage from '@react-native-community/async-storage'
import wsMiddleware from './middleware/websocket'
import rootReducer from './ducks'

console.log(thunk)
console.log('this', AsyncStorage)

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  blacklist: ['loading', 'websockets', 'gameController', 'authentication'],
}

const loggerMiddleware = createLogger()
const persistedReducer = persistReducer(persistConfig, rootReducer)
const log = process.env.NODE_ENV === 'development'

const middleware = [thunk, wsMiddleware, log && loggerMiddleware]

export const store = createStore(
  persistedReducer,
  applyMiddleware(...middleware)
)
export const persistor = persistStore(store)
