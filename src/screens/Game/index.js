import React, { Component } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Icon,
} from 'react-native'
import { connect } from 'react-redux'

import { Dimensions } from 'react-native'
import GameController from './GameController'
import Buttons from './Buttons'
import Board from './Board'


class Game extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      rows: 25,
      cols: 25,
      numColumns: 25,
    }
  }

  render() {
    const { cols, rows } = this.state
    const { grid, players } = this.props
    var draw = false
    var gridItems = null
    if (grid !== null) {
      draw = true
      const drawGrid = [...grid]
      let me_id = null
      for (var key in players) {
        const { x, y } = players[key]
        console.log(players[key])
        console.log(x, y)
        drawGrid[y * cols + x] = { occupied: true, /*"me" : key === true*/ }
      }
      gridItems = drawGrid.map((cell, index) => {
        console.log(cell)
        const x = Math.floor(index / cols),
          y = index % cols
        const key = x.toString() + '-' + y.toString()
        var style
        if (cell && !cell.occupied) {
          style = { ...styles.Wall, ...styles.Cell }
        } else if (!cell.occupied) {
          style = { ...styles.Cell }
        } else if (x == 0 || x == 24 || y == 0 || y == 24) {
          style = { ...styles.Win, ...styles.Cell }
        } 
        // else if( (cell.occupied && cell.me) || index == me_id ){} 
        else {
          style = { ...styles.Occupied, ...styles.Cell }
        }

        return <View key={key} style={style} />
      })
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end",
          backgroundColor: "transparent",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <GameController navigation={this.props.navigation}/>
        <Board gridItems={gridItems}/>
        <Buttons />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
  },

  Board: {
    flex: 1,
    backgroundColor: 'black',
  },

  Cell: {
    width: Dimensions.get('screen').width/30,
    height: Dimensions.get('screen').width/30,
    borderStyle: 'solid',
    borderWidth: 1,
  },

  Win: {
    backgroundColor: 'black',
  },

  Wall: {
    backgroundColor: 'black',
  },

  Occupied: {
    backgroundColor: `hsl(${Math.random()*360},50%,50%)`,
  },

  buttons: {
    flex: 1,
  },
})

function mapStateToProps(state) {
  const { gameController, websockets, authentication } = state
  console.log('\n\n\n',authentication)
  return { jwt: state.session.jwt, roomId: websockets.roomId, grid: gameController.grid, players: gameController.players}
}

export default connect(mapStateToProps)(Game)
