import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ChatScreen from './ChatScreen';

const App = () => {
  return (
    <>
      <StatusBar backgroundColor={'#1e1e1e'}  />
      <SafeAreaView style={styles.container}>
        <Text style={styles.headingtxt}>ChatBot</Text>
        <ChatScreen />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headingtxt:{
    fontSize: 30,
    fontWeight: 'bold',
    color: "#009688",
    textAlign: 'center',
    backgroundColor:'#1e1e1e',
    paddingTop:20
  }
});

export default App;
