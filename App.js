import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import getEnvVars from './environment'
import TaurusApp from './src/TaurusApp'
import { persistor, store } from '@redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TaurusApp />
        </PersistGate>
      </Provider>
    )
  }
}

export default App
