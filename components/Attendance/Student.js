import * as React from "react";
import { useEffect, useState, useContext, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { AntDesign } from "@expo/vector-icons";
import CircularProgress from "react-native-circular-progress-indicator";
import LottieView from "lottie-react-native";

import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
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

import * as Font from "expo-font";
import { DownloadResumable } from "expo-file-system";

import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  Foundation,
  MaterialIcons,
  Ionicons,
  FontAwesome,
  Entypo,
  Fontisto,
} from "@expo/vector-icons";

export default function ({ route, navigation }) {
  const [data, setdata] = useState([]);
  const [fontsLoaded, setfontsLoaded] = useState(false);
  const [info, setinfo] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [loading, setloading] = useState(false);

  //Download file....
  let JsonFields = [
    "Name",
    "subject",
    "Type",
    "Branch",
    "Batch",
    "Rollnubmber",
    "present",
    "absent",
    "attendance",
    "Date",
    "Time",
  ];

  const JsonToCSV = (JsonArray) => {
    let Name = null;
    let csvStr = JsonFields.join(",") + "\n";
    JsonArray.forEach((element) => {
      csvStr +=
        Name +
        "," +
        route.params.info.Data.SubjectName +
        "," +
        route.params.info.Data.Type +
        "," +
        route.params.info.Data.department +
        "," +
        route.params.info.Data.Division +
        "," +
        element.Roll +
        "," +
        element.Present +
        "," +
        element.absent +
        "," +
        element.attendance +
        "," +
        route.params.info.Data.date +
        "," +
        route.params.info.Data.time +
        "\n";
    });

    if (route.params) {
      return csvStr;
    } else {
      return null;
    }
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      RobotoMedium: require("../../assets/fonts/Roboto/Roboto-Black.ttf"),
      RobotoLight: require("../../assets/fonts/Roboto/Roboto-Bold.ttf"),
    });
    setfontsLoaded(true);
  };
  function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for (var i = 0, l = arr.length; i < l; i++) {
      var stringified = JSON.stringify(arr[i]);
      if (itemsFound[stringified]) {
        continue;
      }
      uniques.push(arr[i]);
      itemsFound[stringified] = true;
    }
    return uniques;
  }

  const getdata = async () => {
    let record = [];
    try {
      await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + route.params.id
      ).then((Data) => {
        setdata(JSON.parse(Data).Student);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getdata();
    loadFonts();
    //console.log(JsonToCSV(data));
  }, []);

  const Downloadfile = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      setOverlayVisible(true);
      let filename =
        FileSystem.documentDirectory +
        `${new Date().getTime()}(Student).csv`.toString();
      await FileSystem.writeAsStringAsync(filename, JsonToCSV(data)).then(
        () => {
          // alert("done");
          //alert(JSON.stringify(`${new Date().getTime()}.csv`));
        }
      );
      const asset = await MediaLibrary.createAssetAsync(filename);
      await MediaLibrary.createAlbumAsync("class360", asset, false).then(
        (data) => {
          setOverlayVisible(false);
          Alert.alert("Downloaded", `File saved at ${asset.uri}`, [
            {
              /*
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              */
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        }
      );
    }
  };
  return (
    <>
      {fontsLoaded ? (
        data.length != 0 ? (
          <Div pb="20%" h="100%">
            <ScrollView>
              {data.map((i) => (
                <Div
                  w={"97%"}
                  bg="gray200"
                  mt="lg"
                  justifyContent="space-between"
                  row
                >
                  <Div ml="md" row>
                    <Div
                      w={60}
                      h={60}
                      bg="teal400"
                      rounded="circle"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <AntDesign name="user" size={24} color="white" />
                    </Div>
                    <Text
                      fontFamily="RobotoMedium"
                      fontWeight="bold"
                      color="gray600"
                      ml="lg"
                      fontSize="xl"
                    >
                      {" "}
                      Roll number{" "}
                      <Text fontFamily="RobotoMedium" fontSize="xl">
                        {i.Roll}
                      </Text>
                      {"\n"}
                      <Text fontFamily="RobotoLight" mt="lg">
                        <AntDesign name="user" size={15} color="black" />{" "}
                        Present:{" "}
                        <Text
                          color="gray600"
                          fontFamily="RobotoLight"
                          fontWeight="bold"
                        >
                          {i.Present}
                        </Text>{" "}
                      </Text>{" "}
                      <Text fontFamily="RobotoLight">
                        <AntDesign name="deleteuser" size={16} color="black" />{" "}
                        absent:{" "}
                        <Text color="gray600" fontWeight="bold">
                          {i.absent}
                        </Text>{" "}
                      </Text>{" "}
                    </Text>
                  </Div>
                  <Div justifyContent="center">
                    {/* <CircularProgress
                    value={i.attendance.toFixed(0)}
                    radius={30}
                    inActiveStrokeColor={"#81e6d9"}
                    inActiveStrokeOpacity={0.2}
                    activeStrokeColor={"#38b2ac"}
                    activeStrokeWidth={10}
                    textColor={"#718096"}
                    valueSuffix={"%"}
                  /> */}
                    <Text
                      fontWeight="bold"
                      fontFamily="RobotoMedium"
                      color="gray600"
                    >
                      Attendance {"\n"}
                      {"\n"}
                      <Text fontWeight="bold">{i.attendance.toFixed(0)}%</Text>
                    </Text>
                  </Div>
                </Div>
              ))}
            </ScrollView>
          </Div>
        ) : (
          <Div
            flex={1}
            h={"100%"}
            w="100%"
            justifyContent="center"
            alignItems="center"
          >
            {/* <Image
              style={{ width: 70, height: 70 }}
              source={require("../../assets/animations/loading.gif")}
            /> */}
            <LottieView
              source={require("../../assets/animations/dotloading.json")}
              autoPlay
              loop
            />
          </Div>
        )
      ) : null}

      <Fab
        icon={
          <Icon
            name="download"
            fontFamily="MaterialCommunityIcons"
            fontSize={24}
            color="white"
            h={60}
            w={60}
            rounded="md"
          />
        }
        bg="gray600"
        h={50}
        w={50}
        p={0}
        loading={false}
        onPress={Downloadfile}
      ></Fab>
      {/* <Button
        bg="#bee3f8"
        position="absolute"
        top={"91%"}
        left={"65%"}
        h={50}
        p={0}
        shadow="lg"
        w={50}
        rounded="circle"
        ml="md"
        onPress={() => {
          navigation.navigate("Create");
        }}
      >
        <Entypo name="plus" size={24} color="#2b6cb0" />
      </Button>
      <Button
        bg="gray600"
        h={50}
        w={50}
        rounded="circle"
        position="absolute"
        top="91%"
        left="81%"
        ml="md"
        p={0}
        onPress={Downloadfile}
        shadow="xl"
      >
        <Icon name="download" fontWeight="bold" fontSize="xl" color="white" />
      </Button> */}

      <Overlay visible={overlayVisible} p="xl">
        <Div flexWrap="wrap" row>
          <Image
            style={{ width: 70, height: 70 }}
            source={require("../../assets/animations/download.gif")}
          />
          <Text ml="md" fontSize={"lg"} fontWeight="bold">
            Downloading...
          </Text>
        </Div>
      </Overlay>
    </>
  );
}

{
  /* <Tab.Navigator>
      <Tab.Screen name="Student" component={StudentScreen} data={route.params} />
      <Tab.Screen name="Class" component={ClassScreen} />
    </Tab.Navigator>*/
}
