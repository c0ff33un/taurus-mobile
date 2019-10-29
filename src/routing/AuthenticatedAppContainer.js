import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack' 

import LobbyScreen from '../screens/lobby/LobbyScreen'

const AppNavigator = createStackNavigator(
  {
    Lobby: {screen: LobbyScreen, navigationOptions: { header: null }}
  },
  {
    initialRouteName: 'Lobby'
  }
);

const AuthenticatedAppContainer = createAppContainer(AppNavigator);

export default AuthenticatedAppContainer