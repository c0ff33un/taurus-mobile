import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
//import FeedScreen from '../screens/feed/FeedScreen'
import Login from '../screens/Login'
import SignUp from '../screens/SignUp'
import ValidateEmail from '../screens/ValidateEmail'

// you can also import from @react-navigation/native

const AppNavigator = createStackNavigator(
  {
    Login: { screen: Login, navigationOptions: { header: null }},
    SignUp: { screen: SignUp, navigationOptions: { header: null }},
    ValidateEmail: { screen: ValidateEmail, navigationOptons: { header: null } },
  },
  {
    initialRouteName: 'Login',
  }
)

const UnauthenticatedAppContainer = createAppContainer(AppNavigator)

// Now AppContainer is the main component for React to render

export default UnauthenticatedAppContainer
