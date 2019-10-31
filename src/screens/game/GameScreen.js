import React, { Component } from "react";
import { ScrollView, StyleSheet, View, Text, FlatList } from "react-native";
import { connect } from "react-redux";

import getEnvVars from '../../../environment'

import { Button, TextInput, DefaultTheme } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import { Dimensions } from "react-native";

import { Col, Row, Grid } from "react-native-easy-grid";

const formatData = (data, numColumns) => {
  if(data!=null){
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
  
  }

  return data;
};

class GameScreen extends Component {
  state = {
    window: Dimensions.get('window'),
    rows: Math.floor(Dimensions.get('window').width / 25),
    cols: Math.floor(Dimensions.get('window').width / 25),
    numColumns: 25,
    grid: null,
  };

  setupGame = () => {
    console.log(this.props.jwt)
    const {apiUrl, wsUrl} = getEnvVars
    const seed = Math.floor( Math.random() * Math.pow(10,10))
    const { rows, cols } = this.state;
    const mutation = {
      query:`mutation{grid(settings:{seed:"${seed}" w:"${cols}" h:"${rows}"}){seed exit{x y} matrix}}`
    }

    var apiOptions = {
      method: 'POST',
      headers: { 
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.props.jwt}`
      },
      body: JSON.stringify(mutation),
    }

    fetch(apiUrl, apiOptions)
      .then(res => res.json())
      .catch(err => err)
      .then(res => {
        console.log("######",res)

        let grid = res.data.grid.matrix
        let exit = res.data.grid.exit

        this.setState({grid})

        var currentDistance = 0
        var begin = exit

        for (let x = 0; x < rows; ++x) {
          for (let y = 0; y < cols; ++y) {
            let pos = x * cols + y
            if (grid[pos] === false) {
              let manhattanDistance = Math.abs(x - exit.x ) + Math.abs( y - exit.y )
              if (manhattanDistance > currentDistance) {
                currentDistance = manhattanDistance
                begin = { x, y }
              }
            }
          }
        }
        
        const gsOptions = {
          method : 'PUT',
          body : JSON.stringify({
            rows: parseInt(rows),
            cols: parseInt(cols),
            exit,
            begin,
            grid,
            players: {
              ids: [  ]
            }
          })
        }

        const { roomId } = this.props.screenProps
        fetch(`http://${wsUrl}/room/setup/${roomId}`, gsOptions)
        .then(response => {
          return response.json()
        })
        .catch(err => new Error(err))
        .then(json => {
          console.log(json)
          return json
        })
        .catch((error) => {
          console.log(error)
        })
      })
      .catch(err => console.log(err))
  }

  startGame = () => {
    console.log(this.props.jwt)
  }

  renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View
        style={styles.item}
      >
        <Text style={styles.itemText}>{item.key}</Text>
      </View>
    );
  };
  

  render() {
    return (  
      <ScrollView>
        <TextInput 
          mode="outlined"
          label="Room ID"
          style={styles.lobby}
          value={this.props.screenProps.roomId}
          onChangeText={lobby => this.setState({ lobby })}
          disabled={true}
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
            onPress={this.setupGame}
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
          >Setup Game</Button>

          <Button
            mode="contained"
            dark={true}
            title="Iniciar Sesión"
            onPress={this.startGame}
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
          >Start Game</Button>
        </View>

        <Button 
        style={{position:'absolute', top: Dimensions.get('window').height, left: Dimensions.get('window').height -10}}             
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
            } }
        >
          UP
        </Button>
      </ScrollView>
      
    );
  }
}

const styles = StyleSheet.create({
  grid:{
    borderColor: 'yellow',
    backgroundColor: 'black',
    flex: 1,
  },
  board:{
    flex: 1,
    backgroundColor: "red",
  },
  lobby: {
    flex: 0,
    margin: 8,
    borderColor: "gray"
  },
  buttons: {
    flex: 1, 
    flexDirection: 'row', 
    alignSelf: 'center',
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    marginVertical: 20,
  },
  item: {
    backgroundColor: '#4D243D',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / 25, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
});

function mapStateToProps(state) {
  return {
    jwt: state.session.jwt
  };
}

export default withNavigation(connect(mapStateToProps)(GameScreen));