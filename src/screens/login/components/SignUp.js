import React, { Component } from "react";
import { Text, View, Linking } from "react-native";
 import { Button } from "react-native-paper";
 import { guestLogin } from '@redux/ducks/session';
// import { SocialIcon } from "react-native-elements";
import getEnvVars from "taurusMobile/environment";
// import { Google, /*Facebook,*/ /*AuthSession*/ } from "expo";
// import * as Facebook from 'expo-facebook'; 
import { connect } from "react-redux";
// import { loginWithJWT } from '@redux/actions';

class SignUp extends Component {
  state = {
    loading: false
  };

  handleGuest = () => {
    console.log("Guest")
    this.props.dispatch(guestLogin())
    console.log(this.props.message)
  } 

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "flex-end",
          marginBottom: 10
        }}
      >
        <View style={{ flex: 1 }} />
          <Button  onPress={this.handleGuest} mode="contained">Guest</Button>
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { isLoggingIn } = state.session;
  return { isLoggingIn };
};

export default connect(mapStateToProps)(SignUp);
