import Constants from "expo-constants";
import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Linking,
  ToastAndroid,
  Clipboard,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  Div,
  ThemeProvider,
  Image,
  Badge,
  Input,
  Header,
  Button,
  Host,
  Fab,
  Icon,
  Portal,
  Text,
  Tag,
  Radio,
  Modal,
  Checkbox,
  Overlay,
} from "react-native-magnus";

import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  Foundation,
  AntDesign,
  MaterialIcons,
  Ionicons,
  FontAwesome,
  Entypo,
  Fontisto,
} from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import LoginScreen from "./Login";
import StudenthomeScreen from "../Student/home";
import TimetableviewScreen from "../Student/Timetableview";
import NoticeScreen from "../Student/Notice";
import { auth } from "../../firebase";

function HomeScreen({ navigation }) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home", user);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Image
          style={{ width: 300, height: 300 }}
          source={require("../../assets/wellcom.png")}
        />
        <Text style={styles.Title}>Select your Role</Text>

        {[
          {
            name: "Admin",
            path: "Login",
            text: "Login available only for Teachers",
            icon: "person",
          },
          {
            name: "Timetable ",
            path: "Timetableview",
            text: "Time-table for Students  ",
            icon: "md-time-outline",
          },
          {
            name: "Notice",
            path: "Notice",
            text: "Notice for Students",
            icon: "notifications",
          },
        ].map((i) => (
          <Div
            h="10%"
            w="100%"
            bg="#e6fffa"
            rounded="xl"
            mt="xl"
            justifyContent="space-between"
            row
          >
            <Div justifyContent="center" ml="lg" row>
              <Div h="100%" justifyContent="center">
                <Button bg="#81e6d9" h={50} w={50} rounded="xl" mr="xs" p={0}>
                  <Ionicons name={i.icon} size={24} color="white" />
                </Button>
              </Div>
              <Text fontSize="xl" fontWeight="bold">
                {"\t"}
                {i.name}
                {"\n"}
                <Text fontSize="xs" color="gray600">
                  {"\n"}
                  {"\t"}
                  {i.text}
                </Text>
              </Text>
            </Div>
            <Div h="100%" justifyContent="center">
              <Button
                bg="#81e6d9"
                h={40}
                w={40}
                rounded="xl"
                mr="lg"
                p={0}
                onPress={() => {
                  navigation.navigate(`${i.path}`);
                }}
              >
                <AntDesign name="arrowright" size={24} color="white" />
              </Button>
            </Div>
          </Div>
        ))}
      </View>
    </>
  );
}

export default function ({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Timetableview"
        component={TimetableviewScreen}
        options={{
          title: "Timetable",
        }}
      />
      <Stack.Screen name="Notice" component={NoticeScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  Title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: "10%",
    marginBottom: "10%",
  },
  paragraph: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#718096",
    marginBottom: "10%",
  },
});
