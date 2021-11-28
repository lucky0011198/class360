import * as React from "react";
import { useEffect, useState, useContext, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Attendance, ClassAttendance, auth } from "../../firebase";
import { AntDesign } from "@expo/vector-icons";

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
  Collapse,
  Dropdown,
  Toggle,
} from "react-native-magnus";

function StudentScreen({ route, navigation }) {
  const [data, setdata] = useState([]);
  const [id, setid] = useState("");

  console.log(route.params);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // Prevent default behavior
      e.preventDefault();

      alert("Default behavior prevented");
      // Do something manually
      // ...
    });

    return unsubscribe;
  }, [navigation]);

  let Data = [];

  useEffect(() => {
    Attendance.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((res) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (res.data().uid == user.uid) {
            setdata(JSON.stringify(res.data().Student));
            setid(res.id);
          }
        });
      });
    });
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 10 }}>
      {eval(data).legnth != 0
        ? eval(data).map((i) => (
            <Div
              w={"95%"}
              bg="gray200"
              mt="lg"
              justifyContent="space-between"
              row
            >
              <Div ml="md" row>
                <Div
                  w={60}
                  h={60}
                  bg="gray500"
                  rounded="circle"
                  justifyContent="center"
                  alignItems="center"
                >
                  <AntDesign name="user" size={24} color="white" />
                </Div>
                <Text fontWeight="bold" color="gray600" ml="lg" fontSize="xl">
                  {" "}
                  Roll number <Text fontSize="xl">{i.Roll}</Text>
                  {"\n"}
                  <Text mt="lg">
                    <AntDesign name="user" size={15} color="black" /> Present:{" "}
                    <Text color="gray600" fontWeight="bold">
                      {i.Present}
                    </Text>{" "}
                  </Text>{" "}
                  <Text>
                    <AntDesign name="deleteuser" size={15} color="black" />{" "}
                    absent:{" "}
                    <Text color="gray600" fontWeight="bold">
                      {i.absent}
                    </Text>{" "}
                  </Text>{" "}
                </Text>
              </Div>
              <Div justifyContent="center" h={"100%"} row>
                <Text fontWeight="bold" color="gray600" fontSize="lg">
                  Attendance{" "}
                </Text>
                <Text fontWeight="bold" fontSize="xl">
                  {"\t"}
                  {i.attendance.toFixed(2)}%
                </Text>
              </Div>
            </Div>
          ))
        : null}
    </View>
  );
}

const ClassData = (props) => {
  const [data, setdata] = useState([]);
  return <Text>{props.name}</Text>;
};

function ClassScreen() {
  const [data, setdata] = useState([{}, {}]);

  useEffect(() => {
    let Data = [];
    Attendance.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((res) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (res.data().uid == user.uid) {
            ClassAttendance.onSnapshot((querySnapshot) => {
              querySnapshot.forEach((item) => {
                if (item.data().uid == res.id) {
                  Data.push(item.data());
                }
              });
              setdata(Data);
            });
          }
        });
      });
    });
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 10 }}>
      {eval(data).legnth != 0
        ? eval(data).map((i) => (
            <Div
              w={"95%"}
              bg="gray200"
              mt="lg"
              justifyContent="space-between"
              row
            >
              <Div ml="md" row>
                <Div
                  w={60}
                  h={60}
                  bg="gray500"
                  rounded="circle"
                  justifyContent="center"
                  alignItems="center"
                >
                  <AntDesign name="user" size={24} color="white" />
                </Div>
                <Text fontWeight="bold" color="gray600" ml="lg" fontSize="xl">
                  {" "}
                  Class <Text fontSize="md">{i.date}</Text>
                  {"\n"}
                  <Text mt="lg">
                    <AntDesign name="user" size={15} color="black" /> Present:{" "}
                    <Text color="gray600" fontWeight="bold">
                      {" "}
                      {i.Present}
                    </Text>{" "}
                  </Text>{" "}
                  <Text>
                    <AntDesign name="deleteuser" size={15} color="black" />{" "}
                    absent:{" "}
                    <Text color="gray600" fontWeight="bold">
                      {" "}
                      {i.Absent}
                    </Text>{" "}
                  </Text>{" "}
                </Text>
              </Div>
              <Div justifyContent="center" h={"100%"} row>
                <Text fontWeight="bold" color="gray600" fontSize="lg">
                  Attendance{" "}
                </Text>
                <Text fontWeight="bold" fontSize="xl">
                  {"\t"}
                  {i.ClassAttendance}%
                </Text>
              </Div>
            </Div>
          ))
        : null}
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function ({ navigation }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Student" component={StudentScreen} />
      <Tab.Screen name="Class" component={ClassScreen} />
    </Tab.Navigator>
  );
}
