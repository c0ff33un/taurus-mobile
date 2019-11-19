import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Menu from '../screens/Menu'
import Game from '../screens/Game'

const AppNavigator = createStackNavigator(
  {
    Menu: { screen: Menu, navigationOptions: { header: null }},
    Game: {screen: Game, navigationOptions: { header: null }},
  },
  {
    initialRouteName: 'Menu',
  }
)

const AuthenticatedAppContainer = createAppContainer(AppNavigator)

export default AuthenticatedAppContainer
