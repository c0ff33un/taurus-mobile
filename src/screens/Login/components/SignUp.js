import React, { Component } from "react";
import { Text, View, Linking } from "react-native";
import { Button } from "react-native-paper";
import  { startLoading } from '@redux/ducks/loading'
import { guestLogin } from '@redux/ducks/authentication';
import getEnvVars from "taurusMobile/environment";
import { connect } from "react-redux";

class SignUp extends Component {
  state = {
    loading: false
  };

  handleGuest = () => {
    const { dispatch }  = this.props
    dispatch(startLoading())
    dispatch(guestLogin())
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
          <Button  
            onPress={this.handleGuest} 
            disabled={this.props.loading}
            mode="contained"
          >
            Guest
          </Button>
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { loading } = state;
  return { isLoggingIn: loading };
};

export default connect(mapStateToProps)(SignUp);
