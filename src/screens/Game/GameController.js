import React, { Fragment, useEffect } from 'react'
import { View, Text } from 'react-native'
import { Button, TextInput, DefaultTheme } from 'react-native-paper'
import { Dimensions } from 'react-native'
import { connect, useSelector, useDispatch, batch } from 'react-redux'
import { startLoading, finishLoading } from '@redux/ducks/loading'
import { invalidateGame } from '@redux/ducks/gameController'
import { invalidateMessages } from '@redux/ducks/messageLog'
import { wsMessage, wsDisconnect } from '@redux/ducks/websockets'
import getEnvVars from 'taurusMobile/environment'

import { NavigationActions, StackActions } from 'react-navigation'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks';

const CELL_SIZE = 25
const WIDTH = 625
const HEIGHT = 625

function SetupGame(props) {
  const { room, loading, gameRunning } = useSelector((state) => { 
    return { 
      room: state.websockets.roomId, 
      loading: state.loading, 
      gameRunning: state.gameController.gameRunning 
    } 
  })

  const seed = Math.floor(Math.random() * Math.pow(10, 9)) 
  const rows = HEIGHT / CELL_SIZE
  const cols = WIDTH / CELL_SIZE
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
      style={{ flex: 1, margin: 4,justifyContent:'center' }}
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
      style={{ flex: 1, margin: 4, justifyContent:'center' }}
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

function Redirect(props) {
  const {connected,loading,navigation } = props

  useEffect(() => {
    navigation.dispatch(StackActions.reset({
      index:0,
      actions:[NavigationActions.navigate({ routeName: 'Game' })]
    }))
  })

  return null
}

class GameController extends React.Component {

  constructor(props) {
    super(props)
    this.state = { rows: 25, cols: 25, numColumns: 25 }
  }

  goToMenu = () => {
    const { dispatch } = this.props
    
    batch(()=>{
      dispatch(wsMessage({ type: "leave" }))
      dispatch(wsDisconnect())
      dispatch(invalidateGame())
      dispatch(invalidateMessages())
    })
  }

  render() {
    const { loading, connected } = this.props
    return (
      <Fragment>
        { !connected ? this.props.navigation.navigate('Menu') : 
          <View
          style={{
            flex: 1.2,
            flexDirection: 'column',
            backgroundColor: 'white',
            alignItems: 'stretch',
            width: Dimensions.get('window').width,
          }}
        >
          <Text
            selectable={true}
            style={{ flex: 0.6, justifyContent: 'center', alignSelf:'center', fontSize: Dimensions.get('screen').width/25 }}
          >{`RoomId: ${this.props.roomId}`}</Text>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <SetupGame />
            <StartGame />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              mode="contained"
              disabled={loading}
              title="Return"
              onPress={this.goToMenu}
              style={{ flex: 1, margin: 4, justifyContent:'center'}}
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
        }
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { loading, authentication, gameController, websockets } = state
  return {
    jwt: authentication.token,
    loading,
    ...gameController,
    ...websockets,
  }
}

export default connect(mapStateToProps)(GameController)
      
