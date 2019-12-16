import React from 'react'
import { View } from 'react-native'
import { Button, TextInput, DefaultTheme } from 'react-native-paper'
import { Dimensions } from 'react-native'
import { connect, useSelector, useDispatch } from 'react-redux'
import { startLoading, finishLoading } from '@redux/ducks/loading'
import { invalidateGame } from '@redux/ducks/gameController'
import { invalidateMessages } from '@redux/ducks/messageLog'
import { wsMessage, wsDisconnect } from '@redux/ducks/websockets'
import getEnvVars from 'taurusMobile/environment'

import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks';

const CELL_SIZE = 25
const WIDTH = 625
const HEIGHT = 625

function SetupGame(props) {
  const { room, loading, gameRunning } = useSelector((state) => { 
    return { room: state.websockets.roomId, loading: state.loading, gameRunning: state.gameController.gameRunning } 
  })
  const seed = Math.floor(Math.random() * Math.pow(10, 9)) 
  const rows = HEIGHT / CELL_SIZE
  const cols = WIDTH / CELL_SIZE
  console.log(room, seed, rows, cols)
  const SETUP_GAME = gql`
    mutation {
      roomSetup(room: "${room}", seed: ${seed}, rows: ${rows}, cols: ${cols}) {
        id
      }
    }
  `
  const [ setupGame, { /*loading : loadingMutation,*/ data } ] = useMutation(SETUP_GAME)
  const dispatch = useDispatch()
  if (loading && data) {
    dispatch(finishLoading())
  }
  return (
    <Button
      mode="outlined"
      disabled={loading || gameRunning}
      dark={true}
      onPress={() => {
        dispatch(startLoading())
        setupGame()
      }}
      style={{ flex: 1, height: 55, padding: 10, margin: 4 }}
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
  )
}


function StartGame(props) {
  const { room, loading, gameRunning } = useSelector((state) => { 
    return { room: state.websockets.roomId, loading: state.loading, gameRunning: state.gameController.gameRunning } 
  })

  const START_GAME = gql`
    mutation {
      roomStart(room: "${room}") {
        id
      }
    }
  `
  const [ startGame, { /*loading : loadingMutation,*/ data } ] = useMutation(START_GAME)
  const dispatch = useDispatch()
  if (loading && data) {
    dispatch(finishLoading())
  }
  return (
    <Button
      mode="contained"
      disabled={loading || gameRunning}
      dark={true}
      title="Join Room"
      onPress={() => {
        dispatch(startLoading())
        startGame()
      }}
      style={{ flex: 1, height: 55, padding: 10, margin: 4 }}
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
  )
}

class GameController extends React.Component {

  constructor(props) {
    super(props)
    this.state = { rows: 25, cols: 25, numColumns: 25 }
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
        <View style={{ flex: 3, marginTop: 20, flexDirection: 'row' }}>
          <SetupGame />
          <StartGame />

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
      
