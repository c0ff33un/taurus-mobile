import React from 'react'
import { connect } from 'react-redux'
import { wsMessage } from '@redux/ducks/websockets'

class Buttons extends React.Component {
  
  moveMessage = (direction) => {
    const { dispatch } = this.props;
    dispatch(wsMessage({ type: "move", "direction": direction }))
  }

  keyPressed = (event) => {
    event.preventDefault()
    const { lastPressed } = this.state
    if ((new Date().getTime() - lastPressed) < 50) {
      return
    }
    this.setState({ lastPressed: new Date().getTime() })
    switch (event.key) {
      case 'a':
        this.moveMessage('left');
        break;
      case 's':
        this.moveMessage('down');
        break;
      case 'w':
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
    return (
      <View style={{ flex: 1, width: 400, backgroundColor:'transparent' }}>
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
              position: 'absolute',
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
                width: -800,
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

export default connect(Buttons)
