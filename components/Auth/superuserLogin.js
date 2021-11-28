import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { auth, Users } from "../../firebase";
import { getAuth, getUsers } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SuperuserhomeScreen from "../Superuser/superuserhome";

const Stack = createNativeStackNavigator();

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

function SigninScreen({ navigation }) {
  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [blur, setblur] = useState(1);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("superuserhome", user);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          opacity: blur,
        }}
      >
        <Image
          style={{ width: 50, height: 50 }}
          source={require("../../assets/snack-icon.png")}
        />
        <Text fontWeight="bold" fontSize="4xl" mt="md">
          Class360
        </Text>
        <Text fontSize="xs"> student Data management sysytem</Text>
      </View>

      <View style={styles.container} behavior="padding">
        <Div w="80%" justifyContent="flex-end">
          <Text fontWeight="bold" fontSize="xl" m="md">
            Log in
          </Text>
        </Div>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Email"
            value={email}
            onBlur={() => {
              setblur(1);
            }}
            onFocus={() => {
              setblur(0.1);
            }}
            suffix={
              <MaterialCommunityIcons
                name="email-edit-outline"
                size={24}
                color="#a0aec0"
              />
            }
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <Input
            placeholder="Password"
            value={password}
            onBlur={() => {
              setblur(1);
            }}
            onFocus={() => {
              setblur(0.1);
            }}
            suffix={
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={24}
                color="#a0aec0"
              />
            }
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>

          <Text fontWeight="bold" mr="sm" color="#718096" mt="md">
            Forgot Password
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Signup");
            }}
          >
            <Div justifyContent="center" w="100%" mb="xl" alignItems="center">
              <Text
                fontWeight="bold"
                mr="sm"
                justifyContent="center"
                color="#718096"
                mt="xl"
                pt="xl"
              >
                Don't have an account ?
                <Text fontWeight="bold" color="#4299e1">
                  ..Sign up
                </Text>
              </Text>
            </Div>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default function ({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Signin"
        component={SigninScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Superuserhome"
        component={SuperuserhomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "80%",
    justifyContent: "center",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});
