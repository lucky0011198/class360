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
import firebase from "firebase";
import { getAuth, getUsers } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Google from "expo-google-app-auth";

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

function RequestLoginScreen({ route, navigation }) {
  useEffect(() => {
    Users.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((res) => {
        console.log(res.data().state);
        if (res.id == route.params.uid && res.data().state != "Request") {
          navigation.replace("Home", res);
        }
      });
    });
  }, []);

  return (
    <View
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    ></View>
  );
}

function SignupScreen({ navigation }) {
  const [blur, setblur] = useState(1);
  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Accesskey, setAccesskey] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home", { user, username });
      }
    });
    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        Users.doc(userCredentials.user.uid)
          .set({
            username,
            email,
            AttendanceData: [],
            NoticeData: [],
            TimetableData: [],
            state: "Request",
          })
          .then(() => {
            alert("data stored");
          });
        console.log("Registered with:", user.email);
      })
      .catch((error) => alert(error.message));
    console.log(username);
  };

  // const handleLogin = () => {
  //   auth
  //     .signInWithEmailAndPassword(email, password)
  //     .then((userCredentials) => {
  //       const user = userCredentials.user;
  //       console.log("Logged in with:", user.email);
  //     })
  //     .catch((error) => alert(error.message));
  // };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
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
            Sign up
          </Text>
        </Div>
        <View style={styles.inputContainer}>
          <Input
            placeholder="username"
            suffix={<AntDesign name="user" size={24} color="#a0aec0" />}
            value={username}
            onBlur={() => {
              setblur(1);
            }}
            onFocus={() => {
              setblur(0.1);
            }}
            onChangeText={(text) => setusername(text)}
            style={styles.input}
          />
          <Input
            placeholder="Email"
            suffix={
              <MaterialCommunityIcons
                name="email-edit-outline"
                size={24}
                color="#a0aec0"
              />
            }
            value={email}
            onBlur={() => {
              setblur(1);
            }}
            onFocus={() => {
              setblur(0.1);
            }}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <Input
            placeholder="Password"
            suffix={
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={24}
                color="#a0aec0"
              />
            }
            value={password}
            onBlur={() => {
              setblur(1);
            }}
            onFocus={() => {
              setblur(0.1);
            }}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
          <Input
            placeholder="access key"
            suffix={
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={24}
                color="#a0aec0"
              />
            }
            value={Accesskey}
            onBlur={() => {
              setblur(1);
            }}
            onFocus={() => {
              setblur(0.1);
            }}
            onChangeText={(text) => setAccesskey(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              if (Accesskey == `#LUCKYISGOODBOY`) {
                handleSignUp();
              } else {
                alert("wrong...! access key");
              }
            }}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Signin");
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
    </>
  );
}

function SigninScreen({ navigation }) {
  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [blur, setblur] = useState(1);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home", user);
      }
    });

    return unsubscribe;
  }, []);

  function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  function onSignIn(googleUser) {
    console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((credential) => {
            console.log("user logged in");
          })
          .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  }

  async function signInWithGoogleAsync() {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "1078242764328-v4i1kg3gr679t0a4f1epvi172v8lh90j.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        onSignIn(result);
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  // const handleSignUp = () => {
  //   auth
  //     .createUserWithEmailAndPassword(email, password)
  //     .then((userCredentials) => {
  //       const user = userCredentials.user;
  //       Users.doc(userCredentials.user.uid)
  //         .set({
  //           username,
  //           email,
  //           AttendanceData: [],
  //           NoticeData: [],
  //           TimetableData: [],
  //           state: "Request",
  //         })
  //         .then(() => {
  //           alert("data stored");
  //         });
  //       console.log("Registered with:", user.email);
  //     })
  //     .catch((error) => alert(error.message));
  // };

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
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

          <TouchableOpacity
            onPress={signInWithGoogleAsync}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign in with google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Main");
            }}
            style={{ marginTop: "5%", flexDirection: "row" }}
          >
            <Ionicons
              name="arrow-back-circle-outline"
              size={30}
              color="black"
            />
            <Text fontWeight="bold" mr="sm" color="#718096">
              {""} go back
            </Text>
          </TouchableOpacity>
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
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RequestLogin"
        component={RequestLoginScreen}
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
    marginTop: 10,
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
    marginTop: 10,
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
