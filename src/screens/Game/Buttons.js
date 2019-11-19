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
      <View style={{ flex: 0.5, width: 400 }}>
        {/* Up */}
        <View style={{ flex: 1, alignSelf: 'center' }}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              backgroundColor: '#fff',
              borderRadius: 50,
              alignSelf: 'center',
            }}
            onPress={() => this.keyPressed('u')}
          >
            <Text>Up</Text>
          </TouchableOpacity>
        </View>
        {/* Left Right */}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              flex: 0.5,
              alignSelf: 'flex-start',
              marginLeft: Dimensions.get('window').width / 6,
            }}
          >
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                backgroundColor: '#fff',
                borderRadius: 50,
                alignSelf: 'auto',
              }}
              onPress={() => this.keyPressed('l')}
            >
              <Text>Left</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.5, alignSelf: 'flex-start' }}>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                backgroundColor: '#fff',
                borderRadius: 50,
                alignSelf: 'auto',
              }}
              onPress={() => this.keyPressed('r')}
            >
              <Text>Right</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Down */}
        <View style={{ flex: 1, alignSelf: 'center' }}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              backgroundColor: '#fff',
              borderRadius: 50,
            }}
            onPress={() => this.keyPressed('d')}
          >
            <Text>Down</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect()(Buttons)
