import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import getEnvVars from './environment'
import TaurusApp from './src/TaurusApp'
import { persistor, store } from '@redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

const client = new ApolloClient({
  uri: getEnvVars.apiUrl
})

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <PersistGate loading={null} persistor={persistor}>
            <TaurusApp />
          </PersistGate>
        </ApolloProvider>
      </Provider>
    )
  }
}

export default App
