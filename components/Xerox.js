import * as React from 'react';
import { useState, useEffect, useCallback, createContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  Image,
  TouchableHighlight,
  Alert,
  Linking,
  SafeAreaView,
  Clipboard,
  ToastAndroid,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWindowDimensions } from 'react-native';
import { useFonts } from 'expo-font';
import {
  Toggle,
  Icon,
  Button,
  Div,
  ThemeProvider,
  Radio,
  Text,
  Dropdown,
  Input,
  Fab,
  Snackbar,
  SnackbarRef,
} from 'react-native-magnus';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//icon
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

export default function ({ navigation }) {
  const dropdownRef = React.createRef();
  return (
    <View style={styles.container}>
      <Dropdown
        ref={dropdownRef}
        title={
          <Text mx="xl" color="gray500" pb="md">
            Edite detials
          </Text>
        }
        mt="md"
        pb="2xl"
        justifyContent="center"
        h={'90%'}
        showSwipeIndicator={false}
        roundedTop="xl"
        w={'100%'}
        alignItems="center">
        <ScrollView></ScrollView>
      </Dropdown>

      <TouchableOpacity
        onPress={() => {
          dropdownRef.current.open();
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  button: {
    backgroundColor: '#0782F9',
    padding: 10,
    position: 'absolute',
    top: '90%',
    left: '94%',
    width: '14%',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
