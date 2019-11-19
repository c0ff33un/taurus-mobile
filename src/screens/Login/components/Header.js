import React, { Component } from 'react'
import { View, SafeAreaView, Platform, StyleSheet, Image } from 'react-native'
import { Text, Title } from 'react-native-paper'


export default function Header(props) {
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        τrus
      </Text>
      <Image style={styles.image}
          source={require('../../../../assets/logo/logo_black.png')}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text:{
    flex: 1,
    alignSelf: 'center',
    fontSize: 90,
    fontFamily: 'sans-serif-light',
    fontWeight: "100",
  },
  image: {
    resizeMode: 'center',
    alignSelf: 'center',
    flex: 0.5,
    marginTop: -550,
  },
})