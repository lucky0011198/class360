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
import LoginusersScreen from "./Loginusers";

function HomeScreen({ navigation }) {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.Title}>superuser dhashbord</Text>
        <Text style={styles.paragraph}>Select your role in this app </Text>
        {[
          { name: "Admin (Superuser)", path: "" },
          { name: "User (Teachers)", path: "Login" },
          { name: "Xerox", path: "" },
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
        name="Loginusers"
        component={LoginusersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
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
