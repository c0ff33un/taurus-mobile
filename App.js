import React, { Component } from 'react'
import { Provider } from 'react-redux';

import TaurusApp from './src/TaurusApp'
import configureStore from "@redux/store";

const store = configureStore()

class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <TaurusApp />
      </Provider>
    );
  }
}

export default App;
