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

const CELL_SIZE = 25;
const WIDTH = 625;
const HEIGHT = 625;

class Game extends React.Component {
  
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
      false,
      true,
      false,
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
      true,
      true,
      true,
      true,
      false,
      false,
      true,
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
      true,
      true,
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
      false,
      true,
      true,
      false,
      false,
      true,
      true,
      true,
      true,
      false,
      false,
      true,
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
      true,
      true,
      true,
      true,
      true
    ];

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
    rows: Math.floor(Dimensions.get('window').width / 25),
    cols: Math.floor(Dimensions.get('window').width / 25),
    numColumns: 25,
    grid: null,};
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
  
  moveMessage = (direction) => {
    const { ws } = this.props;
    const obj = {"type": "move", "direction" : direction};
    console.log(direction);
    ws.send(JSON.stringify(obj));
  }
  
  keyPressed = (event) => {
    event.preventDefault();

    while( (new Date().getTime() - lastPressed) < 200 )
    {

    }
    console.log("Sending request")
    console.log(new Date().getTime())
    lastPressed = new Date().getTime()
    switch (event.key) {
      case 'a':
      case 'A':
      case 'ArrowLeft':
        this.moveMessage('left');
        break;
      case 's':
      case 'S':
      case 'ArrowDown':
        this.moveMessage('down');
        break;
      case 'w':
      case 'W':
      case 'ArrowUp':
        this.moveMessage('up');
        break;
      case 'd':
      case 'D':
      case 'ArrowRight':
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
    console.log("RENDER")
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
    const items = []
    for (let i = 0; i < 20; ++i) {
      items.push(<View key={i * 4} style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />);
      items.push(<View key={i * 4 + 1} style={{width: 50, height: 50, backgroundColor: 'skyblue'}} />);
      items.push(<View key={i * 4 + 2} style={{width: 50, height: 50, backgroundColor: 'steelblue'}} />);
      items.push(<View key={i * 4 + 3} style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />);
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-around',
          backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View style={{flex: 1, width: 400, backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap'}}>
          {gridItems}
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
    width: 25,
    height: 25,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'white'
  },
  
  Win: {
    backgroundColor: '#32a852'
  },
  
  Wall: {
    backgroundColor: 'black'
  },
  
  Occupied: {
    backgroundColor: 'red'
  }
});

export default connect()(Game);
