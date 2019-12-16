import React from 'react'
import { View } from 'react-native'
import { Button, TextInput, DefaultTheme } from 'react-native-paper'
import { Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { startLoading, finishLoading } from '@redux/ducks/loading'
import { invalidateGame } from '@redux/ducks/gameController'
import { invalidateMessages } from '@redux/ducks/messageLog'
import { wsMessage, wsDisconnect } from '@redux/ducks/websockets'
import getEnvVars from 'taurusMobile/environment'

const CELL_SIZE = 25
const WIDTH = 625
const HEIGHT = 625

class GameController extends React.Component {

  constructor(props) {
    super(props)
    this.state = { rows: 25, cols: 25, numColumns: 25 }
  }

  goToMenu = () => {
    const { dispatch, connected } = this.props
    if(connected){
      dispatch(wsMessage({ type: "leave" }))
      dispatch(wsDisconnect())
      dispatch(invalidateGame())
      dispatch(invalidateMessages())
    }
    this.props.navigation.navigate('Menu')
  }

  setupGame = () => {
    const { dispatch } = this.props
    dispatch(startLoading())
    const { apiUrl, wsUrl } = getEnvVars
    const seed = Math.floor(Math.random() * Math.pow(10, 10))
    const { rows, cols } = this.state
    const mutation = {
      query: `mutation{grid(settings:{seed:"${seed}" w:"${cols}" h:"${rows}"}){seed exit{x y} matrix}}`,
    }

    var apiOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.jwt}`,
      },
      body: JSON.stringify(mutation),
    }

    console.log('@@@', apiUrl)

    fetch(apiUrl, apiOptions)
    .then(res => res.json())
    .then(res => {
      let grid = res.data.grid.matrix
      let exit = res.data.grid.exit

      var currentDistance = 0
      var begin = exit

      for (let x = 0; x < rows; ++x) {
        for (let y = 0; y < cols; ++y) {
          let pos = x * cols + y
          if (grid[pos] === false) {
            let manhattanDistance =
              Math.abs(x - exit.x) + Math.abs(y - exit.y)
            if (manhattanDistance > currentDistance) {
              currentDistance = manhattanDistance
              begin = { x, y }
            }
          }
        }
      }

      const gsOptions = {
        method: 'PUT',
        body: JSON.stringify({
          rows: parseInt(rows),
          cols: parseInt(cols),
          exit,
          begin,
          grid,
          players: [],
        }),
      }

      const { roomId } = this.props
      fetch(`http://${wsUrl}/room/setup/${roomId}`, gsOptions)
        .then(response => {
          return response.json()
        })
        .then(json => {
          console.log(json)
          return json
        })
        .catch(error => {
          console.log('#####ERROR ALONG THE WAY', error)
          return new Error(error)
        })
      dispatch(finishLoading())
    })
    .catch(err => {
      console.log(err)
      dispatch(finishLoading())
    })
  }

  startGame = () => {
    const { dispatch, roomId } = this.props
    dispatch(startLoading())
    const { wsUrl } = getEnvVars
    const options = {
      method: 'PUT',
    }
    const url = `http://${wsUrl}/room/start/${roomId}`
    console.log(url)
    fetch(url, options)
    .then(res => res.json())
    .then(json => {
      console.log(json)
      dispatch(finishLoading())
      return json
    })
    .catch(err => {
      dispatch(finishLoading())
      return new Error(err)
    })
  }

  render() {
    const { loading } = this.props
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: 'white',
          alignItems: 'stretch',
          width: Dimensions.get('window').width,
        }}
      >
        <TextInput
          mode="outlined"
          style={{ flex: 1.3, justifyContent: 'center', alignSelf:'center', fontSize: 21 }}
          value={`RoomId: ${this.props.roomId}`}
          disabled={true}
          theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              primary: 'black',
              accent: 'black',
              background: 'transparent',
              text: '#272727',
              disabled: '#FDFFFC',
              placeholder: '#272727',
            },
          }}
        />
        <View style={{ flex: 2, flexDirection: 'row' }}>
          <Button
            mode="outlined"
            disabled={loading}
            dark={true}
            onPress={this.setupGame}
            style={{ flex: 1, margin: 4 }}
            theme={{
              ...DefaultTheme,
              colors: {
                primary: '#32322C',
                accent: '#36F1CD',
                background: '#36F1CD',
                surface: '#36F1CD',
                text: '#36F1CD',
                disabled: '#36F1CD',
                placeholder: '#36F1CD',
                backdrop: '#36F1CD',
              },
            }}
          >
            Setup Game
          </Button>

          <Button
            mode="contained"
            disabled={loading}
            dark={true}
            title="Join Room"
            onPress={this.startGame}
            style={{ flex: 1, margin: 4 }}
            theme={{
              ...DefaultTheme,
              colors: {
                primary: '#36F1CD',
                accent: '#F6BD60',
                background: '#FDFFFC',
                surface: '#FDFFFC',
                text: '#FDFFFC',
                disabled: '#FDFFFC',
                placeholder: '#FDFFFC',
                backdrop: '#FDFFFC',
              },
            }}
          >
            Start Game
          </Button>
        </View>
        <View style={{ flex: 2, flexDirection: 'row' }}>
          <Button
            mode="contained"
            disabled={loading}
            title="Return"
            onPress={this.goToMenu}
            style={{ flex: 1, margin: 4 }}
            theme={{
              ...DefaultTheme,
              colors: {
                primary: 'red',
                accent: '#F6BD60',
                background: '#FDFFFC',
                surface: '#FDFFFC', 
                text: '#FDFFFC',
                disabled: '#FDFFFC',
                placeholder: '#FDFFFC',
                backdrop: '#FDFFFC',
              },
            }}
          >
            Return to Menu
          </Button>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return { jwt: state.session.jwt, loading: state.loading, roomId: state.websockets.roomId }
}

export default connect(mapStateToProps)(GameController)
      
