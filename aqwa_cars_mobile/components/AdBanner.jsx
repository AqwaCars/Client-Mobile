import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
const { height,width } = Dimensions.get("window");

export default function AdBanner() {
  return (
    <View style={styles.container}>
      <Animatable.View 
      
      style={{flexDirection:"row"}}
        animation="slide" 
        iterationCount="infinite" 
        duration={6000} 
        easing="linear"
      >
        <Image
          
          source={require('../assets/Sales.png')}// replace with your image URL
          style={styles.image}
        />
         <Image
          source={require('../assets/Sales.png')}  // replace with your image URL
          style={styles.image}
        />
         <Image
          source={require('../assets/Sales.png')}  // replace with your image URL
          style={styles.image}
        />
        
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    flexDirection:'row'
  },
  image: {
    width: width * 1,
    height: height*0.04,
  },
});

// Define the custom animation
Animatable.initializeRegistryWithDefinitions({
  slide: {
    from: { transform: [{ translateX: -width }] },
    to: { transform: [{ translateX: width }] },
  },
});
