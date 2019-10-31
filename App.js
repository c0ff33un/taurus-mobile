import React, { Component } from 'react'
import { Provider } from 'react-redux';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import getEnvVars from './environment'
import TaurusApp from './src/TaurusApp'
import configureStore from "@redux/store";
import AuthenticatedAppContainer from "./src/routing/AuthenticatedAppContainer"

const store = configureStore()

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {ready: false, grid: null, ws: null, messageLog: [], roomId: null, players: {}};
  }

  updatePlayers = (message) => {
    var id = message.id;
    this.setState(prevState => ({...prevState, 
      players : {...prevState.players, 
        [id] : {x : message.x, y : message.y}
      }
    }));
  }

  toggleReady = () => {
    this.setState({ready: !this.state.ready});
    console.log(this.state.ready);
  }

  connect = (roomId, token) => {
    const { wsUrl } = getEnvVars
    var ws = new W3CWebSocket(`ws://${wsUrl}/ws/${roomId}?token=${token}`);

    ws.onopen = () => {
      console.log("Connected");
      this.setState({ ws, roomId, ready: true});
      ws.send(JSON.stringify({type: "connect"}));
    }

    ws.onmessage = (e) => {
      var message = JSON.parse(e.data);
      switch (message.type) {
        case "win":
          console.log(message.id)
          break;
        case "connect":
          var id = message.id;
          console.log("User " + id + " Connected");
          this.setState(prevState => ({...prevState,
            players : {...prevState.players,
              [id] : {}
            },
            messageLog : [...prevState.messageLog, ("User " + id + " Connected")]
          }));
          break;
        case "message":
          this.setState(prevState => ({...prevState,
            messageLog : [...prevState.messageLog, message.text]}
          ))
          break;
        case "move":
          this.updatePlayers(message);
          break;
        case "grid":
          const { grid } = message;
          this.setState({ grid });
          break;
        default:
          console.log("Unhandled Message:")
          console.log(message);
          break;
      }
    }

    ws.onclose = e => {
      console.log(`@@@\n${JSON.stringify(e)}\n@@@`)
      this.setState({ready:false})
    }

    ws.onerror = e => {
      console.log(`@@@\n${JSON.stringify(e)}\n@@@`)
      this.setState({ready:false})
    }
  }

  render() {
    const connect = this.connect;
    const { ready, ws, messageLog, roomId, players, grid } = this.state;
    return (
      <Provider store={store} >
        <TaurusApp appProps={{ready, ws, roomId, players, messageLog, connect, grid}}/>
      </Provider>
    );
  }
}

export default App;
