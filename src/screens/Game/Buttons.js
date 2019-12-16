import React from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { wsMessage } from '@redux/ducks/websockets'

class Buttons extends React.Component {
  constructor(props) {
    super(props)
    this.state = { lastPressed: new Date().getTime() }
  }
  
  moveMessage = (direction) => {
    const { dispatch } = this.props;
    console.log(direction)
    dispatch(wsMessage({ type: "move", "direction": direction }))
  }

  keyPressed = (key) => {
    const { lastPressed } = this.state
    const now = new Date().getTime()
    console.log(lastPressed, '@@@@@', now)
    console.log(key)
    if ((now - lastPressed) < 50) {
      return
    }
    this.setState({ lastPressed: new Date().getTime() })
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
      case 'r':
        this.moveMessage('right');
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <View style={{ position:'absolute', top: Dimensions.get('screen').height*6/16,backgroundColor:'transparent'}}>
        {/* Up */}
        <View style={{ flex: 1, alignSelf: 'center' }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: Dimensions.get('screen').width,
              height: Dimensions.get('screen').height/5,
              backgroundColor: 'rgba(0,172,159,0.05)',
              borderColor: 'transparent',
              alignSelf: 'center',
            }}
            onPress={() => this.keyPressed('u')}
          >
          </TouchableOpacity>
        </View>
        {/* Left Right */}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('screen').width/2,
                height: Dimensions.get('screen').height/6,
                backgroundColor: 'rgba(243,195,0,0.05)',
                borderColor: 'transparent',
              }}
              onPress={() => this.keyPressed('l')}
            >
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignSelf: 'flex-end' }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('screen').width/2,
                height: Dimensions.get('screen').height/6,
                backgroundColor: 'rgba(223,0,36,0.05)',
                borderColor: 'transparent',
                alignSelf: 'auto',
              }}
              onPress={() => this.keyPressed('r')}
            >
            </TouchableOpacity>
          </View>
        </View>
        {/* Down */}
        <View style={{ flex: 1, alignSelf: 'center' }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: Dimensions.get('screen').width,
              height: Dimensions.get('screen').height/5,
              backgroundColor: 'rgba(46,109,180,0.05)',
              borderColor: 'transparent',
            }}
            onPress={() => this.keyPressed('d')}
          >
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect()(Buttons)
