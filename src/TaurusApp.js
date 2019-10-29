import React, { Component, Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { connect } from "react-redux";

import AuthenticatedAppContainer from "./routing/AuthenticatedAppContainer";
import UnauthenticatedAppContainer from "./routing/UnauthenticatedAppContainer";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statusBar: {
    backgroundColor: "#FFF",
    height: getStatusBarHeight()
  }
});


class TaurusApp extends Component  {

  render() {
    console.log("Appjs", this.props);
    const { authenticated } = this.props
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.statusBar} />
        <Fragment>
          {authenticated ? (
            <AuthenticatedAppContainer
              appProps={this.props.appProps}
              style={styles.container}
            />
          ) : (
            <UnauthenticatedAppContainer
              style={styles.container}
            />
          )}
        </Fragment>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { jwt } = state.session
  const authenticated = jwt || false
  return { authenticated }
};

export default connect(mapStateToProps)(TaurusApp);