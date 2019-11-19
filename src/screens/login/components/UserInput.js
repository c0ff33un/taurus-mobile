import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput, Button, Text, DefaultTheme, DarkTheme} from 'react-native-paper'
import { connect } from 'react-redux'
import { login } from '@redux/ducks/session'
import Spinner from 'react-native-loading-spinner-overlay'

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

  render() {

    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Spinner
          visible={this.props.isLoggingIn}
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
        {this.props.loginError && this.state.firstError ? (
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
          <Text style={{ fontSize: 14, }} onPress={(e)=>{e.preventDefault(); this.props.navigation.navigate('SignUp')}}>¿Olvidaste tu contraseña?</Text>
        </View>
        <Button
          mode="contained"
          dark={true}
          title="Iniciar Sesión"
          onPress={this.handleLogin}
          theme={{
              ...DefaultTheme,
              colors: {
                primary: '#13C4A3',
                accent: '#F6BD60',
                background: '#FDFFFC',
                surface: '#FDFFFC',
                text: '#FDFFFC',
                disabled: '#FDFFFC',
                placeholder: '#FDFFFC',
                backdrop: '#FDFFFC',
              }
            }}
        >
          LOG IN
        </Button>
        <Button
            title="Sign Up"
            onPress={() => this.props.navigation.navigate('SignUp')}
            dark={true}
            theme={{
              ...DefaultTheme,
              colors: {
                primary: '#32322C',
                accent: '#F6BD60',
                background: '#FDFFFC',
                surface: '#FDFFFC',
                text: '#FDFFFC',
                disabled: '#FDFFFC',
                placeholder: '#FDFFFC',
                backdrop: '#FDFFFC',
              }
            }}
          >
          SIGN UP
          </Button>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { isLoggingIn, jwt, loginError, message } = state.session
  return { isLoggingIn, jwt, loginError, message, }
}

export default connect(mapStateToProps)(UserInput)
