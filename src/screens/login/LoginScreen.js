import React, { Component } from "react";
import { ScrollView, StyleSheet } from "react-native";
import UserInput from "./components/UserInput";
import SignUp from "./components/SignUp";
import Header from "./components/Header";
import { connect } from "react-redux";

class LoginScreen extends Component {
  
  render() {
    // console.log("login")
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Header />
        <UserInput navigation={this.props.navigation} />
        <SignUp navigation={this.props.navigation} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: "white",
    padding: 0,
  }
});

export default connect()(LoginScreen);
