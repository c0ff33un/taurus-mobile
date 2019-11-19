import React from 'react'
import { View } from 'react-native'

class Board extends React.Component {
  render() {
    const { gridItems } = this.props
    return (
      <View
        style={{
          marginTop: 100,
          flex: 1,
          width: 400,
          backgroundColor: 'white',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {gridItems}
      </View>
    );
  }
}
   
export default Board
