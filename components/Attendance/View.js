import * as React from "react";
import { useEffect, useState, useContext, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
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

import StudentScreen from "./Student";
import ClassScreen from "./Class";

// function StudentScreen({ navigation, route }) {
//   const [data, setdata] = useState([]);
//   const [adata, setadata] = useState([]);
//   const [id, setid] = useState("");

//   let Data = [];
//   let aData = [];
//   const dropdownRef = React.createRef();

//   return <></>;
// }

// function ClassScreen({ navigation, route }) {
//   const [data, setdata] = useState([]);

//   return <View style={{ flex: 1, alignItems: "center", marginTop: 10 }}></View>;
// }

const Tab = createMaterialTopTabNavigator();

export default function ({ route, navigation }) {
  //console.log(route.params);
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Student"
        component={StudentScreen}
        initialParams={{ id: route.params.id, info: route.params }}
      ></Tab.Screen>
      <Tab.Screen
        name="Class"
        component={ClassScreen}
        initialParams={{ id: route.params.id, info: route.params }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}

{
  /* <Tab.Navigator>
      <Tab.Screen name="Student" component={StudentScreen} data={route.params} />
      <Tab.Screen name="Class" component={ClassScreen} />
    </Tab.Navigator>*/
}
