import React, { Component } from "react";
import { Image, ScrollView, StyleSheet, View, Dimensions } from "react-native";
import { connect } from "react-redux";

import getEnvVars from '../../../environment'

import { logout } from '@redux/actions';

import { Text, Button, TextInput, DefaultTheme } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

class LobbyScreen extends Component {
  state = {
    room_id: "",
    jwt: ""
  };

  handleLogOut = () => {
    const options = {
      method : 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': "Bearer " + this.props.jwt,
        "Accept": "application/json"
      },
      body: JSON.stringify({
        query: `mutation {logout{msg}}`
      })
    }
    const {apiUrl} = getEnvVars
    fetch(apiUrl, options)
      .catch(error => {throw new Error(error)})
    this.props.dispatch(logout())
  }

  handleCreateRoom = () => {
    console.log(this.props.jwt)
    const options = {
      method : 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${this.props.jwt}`
      },
      body: JSON.stringify({
        query: "mutation{room{id}}"
      })
    }
    const {apiUrl} = getEnvVars
    return fetch(apiUrl, options)
      .then(res => res.json())
      .catch(err => console.log(err))
      .then(res => {
        console.log(res)
        if(!res.data){
          console.log("No data")
        } else {
          this.setState({room_id: res.data.room.id})

          this.props.screenProps.connect(this.state.room_id, this.props.jwt)
          this.props.navigation.navigate({routeName: 'Game',})
        }
        return res
      })
      .catch(error => {throw new Error(error)})
    
  }

  handleJoinRoom = () =>{
    const {room_id} = this.state, {jwt} = this.props
    this.props.screenProps.connect(room_id, jwt)
    this.props.navigation.navigate({routeName: 'Game',})
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>
          τrus
        </Text>
        <Button
          mode="contained"
          dark={true}
          title="Create Room"
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
            }
          }}
        >Create Room</Button>
        <View style={styles.buttons}>
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
          <Button
            mode="contained"
            dark={true}
            title="Join Room"
            onPress={this.handleJoinRoom}
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
              }
            }}
          >Join Room</Button>
        </View>
        <View style={{flex:1, flexDirection:'column-reverse'}}>
          <Button 
          mode="text"
          style={styles.outButton}
          dark={true}
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
              }
            }}><Text style={{color:'red', fontWeight:'900', 
            fontFamily: 'sans-serif-medium',fontSize:14}}>LOG OUT</Text></Button>
        </View>

      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.session.jwt
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignContent:'flex-start',
  },
  createButton:{
    flex: 0.15, 
    margin:7, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  joinButton:{
    flex: 1, 
    margin: 6, 
    height: 58, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  outButton:{
    flex:0.14, 
    margin:7, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  lobby: {
    flex: 1,
    marginLeft: 8,
    width: Dimensions.get("window").width / 3
  },
  buttons: {
    flex: 1, 
    flexDirection: 'row', 
    alignSelf: 'center'
  },
  text:{
    flex: 0.3,
    alignSelf: 'center',
    fontSize: 90,
    fontFamily: 'sans-serif-light',
    fontWeight: "100",
  },
});

export default withNavigation(connect(mapStateToProps)(LobbyScreen));