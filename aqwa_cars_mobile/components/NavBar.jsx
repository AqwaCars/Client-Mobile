import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get("window");

const NavTab = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [slideAnim] = useState(new Animated.Value(0)); // Initialize slideAnim with 0
  const position = {
    NewHome: 0,
    AdvancedSearch: width * 0.25,
    BookingHistory: width * 0.5,
    NewProfile: width * 0.75,
  };

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: position[route.name],
      useNativeDriver: false,
      bounciness: 10,
    }).start();
  }, [route, slideAnim, position]);

  const handlePress = (tabName) => {
    navigation.navigate(tabName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={() => handlePress('NewHome')}>
        <Icon name="home" size={20} color={route.name === 'NewHome' ? '#8c52ff' : '#bdbdbd'} />
        {route.name === 'NewHome' && <Text style={[styles.tabText, { color: '#8c52ff' }]}>Home</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => handlePress('AdvancedSearch')}>
        <Icon name="search" size={20} color={route.name === 'AdvancedSearch' ? '#8c52ff' : '#bdbdbd'} />
        {route.name === 'AdvancedSearch' && <Text style={[styles.tabText, { color: '#8c52ff' }]}>Search</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => handlePress('BookingHistory')}>
        <Icon name="history" size={20} color={route.name === 'BookingHistory' ? '#8c52ff' : '#bdbdbd'} />
        {route.name === 'BookingHistory' && <Text style={[styles.tabText, { color: '#8c52ff' }]}>History</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => handlePress('NewProfile')}>
        <Icon name="person" size={20} color={route.name === 'NewProfile' ? '#8c52ff' : '#bdbdbd'} />
        {route.name === 'NewProfile' && <Text style={[styles.tabText, { color: '#8c52ff' }]}>Profile</Text>}
      </TouchableOpacity>
      <Animated.View style={[styles.tabIndicator, { transform: [{ translateX: slideAnim }]}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ebebeb',
    height: height * 0.09,
    width: width * 1,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.25,
    height: height * 0.1
  },
  tabText: {
    fontSize: 14,
    marginTop: 4,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#8c52ff',
    height: 3,
    width: width * 0.25,
  },
});

export default NavTab;
