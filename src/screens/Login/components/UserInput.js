import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput, Button, Text, DefaultTheme, DarkTheme} from 'react-native-paper'
import { connect } from 'react-redux'
import { startLoading } from '@redux/ducks/loading'
import { login, guestLogin } from '@redux/ducks/authentication'
import Spinner from 'react-native-loading-spinner-overlay'
import { withNavigation } from 'react-navigation'

const colorTextInput = "#FF6B35";

const styles = StyleSheet.create({
  email: {
    margin: 8,
    borderColor: "gray"
  },
  pass: {
    margin: 8,
    marginTop: 2
  },
  error: {
    color: "white",
    fontStyle: "italic"
  },
  errorDiv: { 
    flexDirection: 'row',
    height: 30, 
    margin: 7, 
    backgroundColor: "#D91E36", 
    alignItems:'center', 
    justifyContent:'center', 
    borderRadius: 3
  }
});

const validation = state => {
  typeof state.email == String && state.email.indexOf;
};

function CustomButton(props){

  return (
    <Button
    mode="contained"
    dark={true}
    title="Login"
    style={{
      flex:1,
      margin: 6,
      maxHeight: 40,
    }}
    onPress={props.onPress}
    theme={{
        colors: {
          primary: props.color,
        }
      }}
  >
    {props.text}
  </Button>
  )
}

class UserInput extends Component {
  state = {
    email: "",
    pass: "",
    error: false,
    firstError: false,
    loading: false,
    overlayColor: "",
  };

  handleLogin = () => {
    this.setState({ firstError: true })
    const { email, pass } = this.state
    this.props.dispatch(login(email, pass))
    console.log(this.props.message)
  }

  handleGuest = () => {
    const { dispatch }  = this.props
    dispatch(startLoading())
    dispatch(guestLogin())
  } 

  render() {

    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Spinner
          visible={this.props.loggingIn}
          textContent={"Loading"}
          textStyle={styles.spinnerTextStyle}
          color={"#F6BD60"}
          textStyle = {{
              color: "white"
          }}
          overlayColor={"#13C4A3"}
          animation={"fade"}
          size={"large"}
        />
        {this.props.error && this.state.firstError ? (
          <View style={styles.errorDiv}>
            <Text style={styles.error}>
              {" "}
              {this.props.message.split(`"error":"`)[1].split(`"}`)[0]}
            </Text>
          </View>
        ) : null}
        <TextInput
          mode="outlined"
          label="Email"
          error={this.state.error}
          style={styles.email}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              primary: '#6290C3',
              accent: '#272727',
              background: '#FDFFFC',
              text: '#272727',
              disabled: '#FDFFFC',
              placeholder: '#272727',
            }
          }}
        />
        <TextInput
          mode="outlined"
          label="Password"
          error={this.state.error}
          secureTextEntry={true}
          style={styles.pass}
          value={this.state.pass}
          onChangeText={pass => this.setState({ pass })}
          theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              primary: '#6290C3',
              accent: '#272727',
              background: '#FDFFFC',
              text: '#272727',
              disabled: '#FDFFFC',
              placeholder: '#272727',
            }
          }}
        />
        <View
          style={{ alignSelf: "flex-end", marginBottom: 20, marginRight: 9 }}
        >
          <Text style={{ fontSize: 14, }} onPress={(e)=>{e.preventDefault(); this.props.navigation.navigate('SignUp')}}>Don't have an account? Sign Up</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}
        >
          <CustomButton text={"Login"} onPress={this.handleLogin} color={"#3f51b5"} />
          <CustomButton text={"Guest"} onPress={this.handleGuest} color={"#f50057"} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading, authentication } = state
  const { jwt, error, message } = authentication
  return { loggingIn:loading, jwt, error, message, }
}

export default withNavigation(connect(mapStateToProps)(UserInput))
