import React, { Component } from 'react'
import { View, SafeAreaView, Platform, StyleSheet, Image, Dimensions } from 'react-native'
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
    flex: 1
  },
  text:{
    flex: 1,
    fontFamily: 'sans-serif-light',
    fontSize: Dimensions.get('screen').height/5,
    fontWeight: "100",
    includeFontPadding: true,
    textAlign: 'center',
    textAlignVertical: "center",
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    width: Dimensions.get('screen').width,
    backgroundColor: 'transparent',
  },
})