import React, { Component } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";

import getEnvVars from '../../../environment'

import { Button, TextInput, DefaultTheme } from 'react-native-paper';

class LobbyScreen extends Component {
  state = {
    room_id: ""
  };

  handleCreateRoom = () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: `"query": "mutation{room{id}}"`
    }
    const { apiUrl } = getEnvVars
    console.log(`apiUrl: ${apiUrl}`)
    fetch(`http://${apiUrl}`, options)
      .then(res => res.json())
      .then(res => {
        if(!res.data){
          dispatch(receiveJWTError("waat"))
        } else {
          room_id = res.data.room.id
          console.log(room_id)
          this.setState({room_id: room_id})
        }
        return res
      })
      .catch(error => {throw new Error(error)})
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput 
          mode="outlined"
          label="Room ID"
          style={styles.lobby}
          value={this.state.room_id}
          onChangeText={room_id => this.setState({ room_id })}
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
            }
          }}
        />
        <View style={styles.buttons}>
          <Button
            mode="contained"
            dark={true}
            title="Iniciar Sesión"
            onPress={this.handleCreateRoom}
            style={{flex: 1}}
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
              }
            }}
          >Create Room</Button>

          <Button
            mode="contained"
            dark={true}
            title="Iniciar Sesión"
            onPress={console.log("Pressed")}
            style={{paddingLeft: 10, flex: 1}}
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
              }
            }}
          >Join Room</Button>
        </View>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
  },
  lobby: {
    margin: 8,
    borderColor: "gray"
  },
  buttons: {
    flex: 1, 
    flexDirection: 'row', 
    alignSelf: 'center'
  }
});

export default connect()(LobbyScreen);