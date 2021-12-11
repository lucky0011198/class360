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

import TimetableviewScreen from "./Timetableview";
import NoticeScreen from "./Notice";

function HomeScreen({ navigation }) {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.Title}>Student</Text>
        <Text style={styles.paragraph}>this users can only view data </Text>
        {[
          { name: "Timetable", path: "Timetableview" },
          { name: "notice", path: "Notice" },
        ].map((i) => (
          <Div
            h="10%"
            w="100%"
            bg="#e6fffa"
            rounded="xl"
            mt="lg"
            justifyContent="space-between"
            row
          >
            <Div justifyContent="center" ml="lg" row>
              <Div h="100%" justifyContent="center">
                <Button bg="#81e6d9" h={50} w={50} rounded="xl" mr="xs" p={0}>
                  <AntDesign
                    name="user"
                    size={24}
                    fontWeight="bold"
                    color="white"
                  />
                </Button>
              </Div>
              <Text fontSize="xl" fontWeight="bold">
                {"\t"} {"\t"}
                {i.name}
                {"\n"}
                <Text fontSize="xs">
                  {" "}
                  {"\t"}
                  {"\t"}This can only view the data
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
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Notice" component={NoticeScreen} />
      <Stack.Screen name="Timetableview" component={TimetableviewScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    padding: 24,
  },
  Title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "10%",
  },
  paragraph: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#718096",
    marginBottom: "10%",
  },
});
