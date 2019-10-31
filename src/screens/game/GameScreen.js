import React, { Component } from "react";
import { ScrollView, StyleSheet, View, Text} from "react-native";
import { connect } from "react-redux";

import getEnvVars from '../../../environment'

import { Button, TextInput, DefaultTheme } from 'react-native-paper';
import { Dimensions } from "react-native";

const CELL_SIZE = 25;
const WIDTH = 625;
const HEIGHT = 625;

var lastPressed = new Date().getTime()

class GameScreen extends React.Component {
  
  constructor(props) {
    super(props);
    const rows = HEIGHT / CELL_SIZE, cols = WIDTH / CELL_SIZE;
    const grid = [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      true,
      true,
      false,
      true,
      true,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      true,
      true,
      true,
      true,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      false,
      true,
      true,
      false,
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      true,
      true,
      true,
      false,
      false,
      false,
      true,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      true,
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      true,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      true,
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      true,
      true,
      true,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      true,
      false,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      true,
      true,
      true,
      true,
      false,
      false,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      true,
      false,
      true,
      true,
      false,
      false,
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      false,
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true
  ]

    // for (let row = 0; row < rows; ++row) {
    //   for (let col = 0; col < cols; ++col) {
    //     const wall = false;
    //     grid.push({row, col, wall});
    //   }
    // }
  this.state = {
    rows, 
    cols, 
    grid,
    players: {},    
    window: Dimensions.get('window'),
    rows: 25,
    cols: 25,
    numColumns: 25,};
  }


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
            players: []
          })
        }

        const { roomId } = this.props.screenProps
        fetch(`http://${wsUrl}/room/setup/${roomId}`, gsOptions)
        .then(response => {
          
          return response.json()
        })
        .catch(err => {
          console.log("#####ERROR JSON")
          return new Error(err)
        })
        .then(json => {
          console.log(json)
          return json
        })
        .catch((error) => {
          console.log("#####ERROR ALONG THE WAY",error)
          return new Error(error)
        })
      })
      .catch(err => console.log(err))
  }

  startGame = () => {
    console.log(this.props.jwt)
  }
  
  moveMessage = (direction) => {
    //const { ws } = this.props;
    const obj = {"type": "move", "direction" : direction};
    console.log(direction);
    //ws.send(JSON.stringify(obj));
  }
  
  keyPressed = (key) => {
    
    // while( (new Date().getTime() - lastPressed) < 200 )
    // {

    // }

    console.log("Sending request")
    console.log(new Date().getTime())
    lastPressed = new Date().getTime()
    switch (key) {
      case 'l':
        this.moveMessage('left');
        break;
      case 'd':
        this.moveMessage('down');
        break;
      case 'u':
        this.moveMessage('up');
        break;
      case 'd':
        this.moveMessage('right');
        break;
      default:
        break;
    }
  }

  render() {
    const { players } = this.props;
    const { cols, rows } = this.state;
    const { grid } = this.state;
    var draw = false;
    var gridItems = null;
    if (grid !== null) {
      draw = true;
      const drawGrid = [...grid];
      // for (var key in players) {
      //   var x = players[key]["x"];
      //   var y = players[key]["y"];
      //   console.log(players[key])
      //   console.log(x, y)
      //   drawGrid[y * cols + x] = {"occupied": true};
      // }
      console.log("CHECK THIS");
      console.log(drawGrid);
      gridItems = drawGrid.map((cell, index) => {
        const x = Math.floor(index / cols), y = index % cols;
        const key = x.toString() + '-' + y.toString();
        var style;
        if (cell && !cell.occupied) {
          style = {...styles.Wall, ...styles.Cell};
        } else if( !cell.occupied ) {
          style = {...styles.Cell}
        } else if( x == 0 || x == 24 || y == 0 || y == 24 ) {
          style = {...styles.Win, ...styles.Cell}
        } else {
          style = {...styles.Occupied, ...styles.Cell}
        }

        return <View
            key={key}
            style={style}></View>
      }
      )
    }
    console.log("gridItems", gridItems)
    console.log('GameProps:', this.props)
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-around',
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View style={{flex:0.25,flexDirection: 'column',backgroundColor: 'black', alignItems:'stretch',width:Dimensions.get("window").width}}>
        
        <TextInput 
            mode="outlined"
            label="Room ID"
            style={{flex:1, justifyContent: 'center'}}
            value={this.props.screenProps.roomId}
            onChangeText={room_id => this.setState({ room_id })}
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
        <View style={{flex:1,flexDirection:'row'}}>
        <Button
        mode="contained"
        dark={true}
        title="Create Room"
        onPress={this.setupGame}
        style={{flex:1, height: 60, padding: 10, margin:4}}
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
        title="Join Room"
        onPress={this.startGame}
        style={{flex:1, height: 60, padding: 10, margin:4}}
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
        </View>
        <View style={{flex: 1, width: 400, backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap'}}>
          {console.log(this.state.grid.length)}
          {gridItems}
        </View>

        {/* Buttons */}

        <View style={{flex: 0.75, width: 400}}>
          {/* Up */}
          <View style={{flex:1, alignSelf:'center'}}>
            <Button style={{height: 100, width: 150, backgroundColor: "black"}} mode="oulined" onPress={console.log("Arriba")}>Up</Button>
          </View>
          {/* Left Right */}
          <View style={{flex:1, flexDirection:"row"}}>
            <View style={{flex: 1, alignSelf: "flex-start"}}>
              <Button style={{height: 100, width: 150, backgroundColor: "black"}} mode="outlined" onPress={this.keyPressed("l")}>Left</Button>
            </View>
            <View style={{flex: 0.6, alignSelf: "flex-end"}}>
            <Button style={{height: 100, width: 150, backgroundColor: "black"}} mode="contained" onPress={this.keyPressed("r")}>Right</Button>
            </View>
          </View>
          {/* Down */}
          <View style={{flex:1, alignSelf:'center'}}>
            <Button style={{height: 100, width: 150, backgroundColor: "black"} } mode="contained" onPress={this.keyPressed("u")}>Down</Button>
          </View>
        </View>
      </View>
    );  
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow'
  },
  
  Board: {
    flex: 1,
    backgroundColor: "black",
  },
  
  Cell: { 
    width: 16,
    height: 16,
    borderStyle: 'solid',
    borderWidth: 1
  },
  
  Win: {
    backgroundColor: '#32a852'
  },
  
  Wall: {
    backgroundColor: 'black'
  },
  
  Occupied: {
    backgroundColor: 'red'
  },
  
  buttons:{
    flex:1,
  }
});

function mapStateToProps(state) {
  return {
    jwt: state.session.jwt
  };
}

export default connect(mapStateToProps)(GameScreen);
