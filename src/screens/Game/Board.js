import React from 'react'
import { View, Dimensions } from 'react-native'

class Board extends React.Component {
  render() {
    const { gridItems } = this.props
    return (
      <View
        style={{
          marginTop: Dimensions.get('screen').height/6,
          flex: 6,
          width: Dimensions.get('screen').width-Dimensions.get('screen').width/6,
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
