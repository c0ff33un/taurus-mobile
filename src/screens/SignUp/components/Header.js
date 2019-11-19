import React, { Component } from 'react'
import { Text, View, SafeAreaView, Platform, StyleSheet, Image } from 'react-native'


function Header(props) {
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
    backgroundColor: 'transparent'
  },
  image: {
    resizeMode: 'center',
    alignSelf: 'center',
    flex: 1,
    marginTop: -110,
  },
  text:{
    flex: 1,
    alignSelf: 'center',
    fontSize: 90,
    fontFamily: 'sans-serif-light',
    fontWeight: "100",
  },
})
export default Header;