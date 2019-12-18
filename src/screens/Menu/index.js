import React, { Component, Fragment, useEffect } from 'react'
import { Image, ScrollView, StyleSheet, View, Dimensions } from 'react-native'
import { connect, batch } from 'react-redux'

import getEnvVars from 'taurusMobile/environment'

import { logout } from '@redux/ducks/authentication'
import { startLoading } from '@redux/ducks/loading'
import { invalidateGame } from '@redux/ducks/gameController'
import { invalidateMessages } from '@redux/ducks/messageLog'
import { wsConnect, wsMessage } from '@redux/ducks/websockets'

import { Text, Button, TextInput, DefaultTheme } from 'react-native-paper'
import { withNavigation, NavigationActions, StackActions } from 'react-navigation'

class MenuScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      roomId: "",
    }
  }

  handleLogOut = () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.jwt,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `mutation {logout{msg}}`,
      }),
    }
    const { apiUrl } = getEnvVars
    fetch(apiUrl, options).catch(error => {
      throw new Error(error)
    })
    this.props.dispatch(logout())
  }

  handleCreateRoom = () => {
    const { dispatch, jwt } = this.props
    dispatch(startLoading())
    dispatch(invalidateGame())
    dispatch(invalidateMessages())
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        query: 'mutation{room{id}}',
      }),
    }
    const { apiUrl } = getEnvVars
    return fetch(apiUrl, options)
      .then(res => res.json())
      .catch(err => console.log(err))
      .then(res => {
        console.log(res)
        if (!res.data) {
          console.log('No data')
          return res
        } else {
          const roomId = res.data.room.id
          this.setState({ roomId })
          console.log('params:', jwt, roomId)
          dispatch(wsConnect({ token: jwt, roomId }))
          this.props.navigation.navigate('Game')
        }
        return res
      })
      .catch(error => {
        throw new Error(error)
      })
  }

  joinRoom = () => {
    const { roomId } = this.state,
      { jwt, dispatch } = this.props

    batch(() => {
      dispatch(startLoading())
      dispatch(invalidateGame())
      dispatch(invalidateMessages())
      dispatch(wsConnect({ token:jwt, roomId }))
    }) 
  }

  render() {
    const { loading, connected } = this.props

    return (
      <Fragment>
        { connected ? this.props.navigation.replace('Game') :
        
          <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.text}>τrus</Text>
          <View style={styles.buttons}>
            <View style={styles.createButtons}>
              <Button
                mode="contained"
                dark={true}
                title="Create Room"
                disabled={loading}
                onPress={this.handleCreateRoom}
                style={styles.createButton}
                theme={{
                  ...DefaultTheme,
                  colors: {
                    primary: '#6290C3',
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
                Create Room
              </Button>
            </View>
            <View style={styles.joinButtons}>
              <TextInput
                mode="outlined"
                label="Room ID"
                disabled={loading}
                style={styles.roomInput}
                value={this.state.roomId}
                onChangeText={(roomId) => this.setState({ roomId })}
                theme={{
                  ...DefaultTheme,
                  colors: {
                    ...DefaultTheme.colors,
                    primary: '#6290C3',
                    accent: '#272727',
                    background: '#FDFFFC',
                    text: '#272727',
                    disabled: '#FDFFFC',
                    placeholder: '#272727',
                  },
                }}
              />
              <Button
                mode="contained"
                dark={true}
                title="Join Room"
                disabled={loading}
                onPress={this.joinRoom}
                style={styles.joinButton}
                theme={{
                  ...DefaultTheme,
                  colors: {
                    primary: '#FE938C',
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
                Join Room
              </Button>
            </View>
          </View>
          
          <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
            <Button
              mode="text"
              style={styles.outButton}
              dark={true}
              disabled={loading}
              onPress={this.handleLogOut}
              theme={{
                ...DefaultTheme,
                colors: {
                  primary: '#E84855',
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
              <Text
                style={{
                  color: 'red',
                  fontWeight: '900',
                  fontFamily: 'sans-serif-medium',
                  fontSize: 14,
                }}
              >
                LOG OUT
              </Text>
            </Button>
          </View>
        </ScrollView>
        }
      </Fragment>
    )
  }
}

const h = Dimensions.get('screen').scale*13
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flex: 10,
    flexDirection: 'column',
    alignSelf: 'center',
  },
  createButtons: {
    margin: 7,
    height: h
  },
  createButton: {
    flex:1, 
    minWidth: Dimensions.get('screen').width*97/100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtons:{
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  joinButton: {
    flex: 1,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    height: h
  },
  roomInput: {
    flex: 1,
    marginLeft: 8,
    height: h
  },
  outButton: {
    flex: 1,
    margin: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 2,
    alignSelf: 'center',
    fontSize: Dimensions.get('screen').height/9,
    fontFamily: 'sans-serif-light',
  },
})

function mapStateToProps(state) {
  const { loading, authentication, websockets } = state

  return { 
    loading, 
    jwt: authentication.jwt, 
    connected: websockets.connected
  }
}

export default withNavigation(connect(mapStateToProps)(MenuScreen))
