import React, { Component, Fragment } from 'react'
import { StyleSheet, View, Alert, AsyncStorage } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { connect } from "react-redux"

import AuthenticatedAppContainer from './routing/AuthenticatedAppContainer'
import UnauthenticatedAppContainer from './routing/UnauthenticatedAppContainer'

import firebase from 'react-native-firebase'

import { checkPermission } from '@redux/ducks/messages'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statusBar: {
    backgroundColor: "transparent",
    height: getStatusBarHeight()
  }
});


class TaurusApp extends Component  {
  async componentDidMount() {
    if (this.props.fmcToken === '') {
      this.props.dispatch(checkPermission());
    }
    this.createNotificationListeners(); //add this line
  }

  componentWillUnmount() {
    this.notificationListener;
    this.notificationOpenedListener;
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      console.log('onNotification:');
      
        const localNotification = new firebase.notifications.Notification({
          show_in_foreground: true,
        })
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setBody(notification.body)
        .android.setChannelId('taurus_default_channel') // e.g. the id you chose above
        .android.setSmallIcon('@drawable/ic_stat_ic_notification') // create this icon in Android Studio
        .android.setColor('#C0FF33') // you can set a color here
        .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));
    });

    const channel = new firebase.notifications.Android.Channel('taurus_default_channel', 'DUDE', firebase.notifications.Android.Importance.High)
      .setDescription('Funciona, Fucker!')
    firebase.notifications().android.createChannel(channel);

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      console.log('onNotificationOpened:');
      if(title  && body ) Alert.alert(
        title, 
        body,
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ])
      else Alert.alert(
        'App was kinda sleepy',
        `But you couldn't resist to one more game, didn't you?`,
        [
          {text: 'Yup', onPress: () => console.log('Ask me later pressed')},
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Okay', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      console.log('getInitialNotification:');
      if(title  && body ) Alert.alert(title, body)
      else Alert.alert(
        'Thanks for playing again 😍',
        'Taurus™ wishes you the very best!',
        [
          {
            text: 'Bye',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Cool', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log("JSON.stringify:", JSON.stringify(message));
    });
  }
  render() {
    const { authenticated } = this.props
    return (
       <View style={{ flex: 1 }}>
        <Fragment>
          {authenticated ? (
            <AuthenticatedAppContainer
              screenProps = {this.props.appProps}
              style={styles.container}
            />
          ) : (
            <UnauthenticatedAppContainer
              screenProps = {this.props.appProps}
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
  const { messages } = state
  const authenticated = jwt || false
  return { authenticated, fcmToken: messages.fcmToken }

};

export default connect(mapStateToProps)(TaurusApp);
