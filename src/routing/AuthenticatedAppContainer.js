import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack' 

import LobbyScreen from '../screens/lobby/LobbyScreen'
import GameScreen from '../screens/game/GameScreen'

const AppNavigator = createStackNavigator(
  {
    Lobby: {
      screen: LobbyScreen,
      navigationOptions: { header: null, },
    },
    Game: {
      screen: GameScreen,
      navigationOptions: { header: null, },
    }
  },
  {
    initialRouteName: 'Lobby',
    
  }
);


const AuthenticatedAppContainer = createAppContainer(AppNavigator);

export default AuthenticatedAppContainer