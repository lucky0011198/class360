import * as React from "react";
import { useEffect, useState, useContext, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { AntDesign } from "@expo/vector-icons";
//import CircularProgress from "react-native-circular-progress-indicator";

import * as MediaLibrary from "expo-media-library";
//import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as Linking from "expo-linking";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
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
import * as FileSystem from "expo-file-system";
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
import LottieView from "lottie-react-native";
export default function ({ route, navigation }) {
  const [data, setdata] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

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
    await FileSystem.readAsStringAsync(
      FileSystem.documentDirectory + route.params.id
    ).then((Data) => {
      setdata(JSON.parse(Data).Attendance);
    });
  };

  let JsonFields = [
    "SubjectName",
    "Branch",
    "Batch",
    "Total",
    "present",
    "absent",
    "ClassAttendance",
    "date",
    "Time",
  ];
  let studentData = ["Name", "Roll", "Present", "Absent", "Attendance"];

  const JsonToCSV = (JsonArray) => {
    let csvStr = JsonFields.join(",") + "\n";
    csvStr +=
      route.params.info.Data.SubjectName +
      "," +
      route.params.info.Data.Type +
      "," +
      route.params.info.Data.department +
      "," +
      route.params.info.Data.Division +
      "," +
      JsonArray.Present +
      "," +
      JsonArray.Absent +
      "," +
      JsonArray.ClassAttendance +
      "," +
      JsonArray.date +
      "," +
      JsonArray.Time +
      "," +
      "\n";

    csvStr += "-----" + "Present Student data" + "------" + "\n";
    csvStr += studentData.join(",") + "\n";
    let Name = null;
    JsonArray.PresentData.forEach((element) => {
      csvStr +=
        Name +
        "," +
        element.Roll +
        "," +
        element.Present +
        "," +
        element.absent +
        "," +
        element.attendance.toFixed(2) +
        "\n";
    });
    csvStr += "-----" + "Present Student data" + "------" + "\n";
    csvStr += studentData.join(",") + "\n";
    JsonArray.AbsentData.forEach((element) => {
      csvStr += element.Name
        ? element.Name
        : null +
          "," +
          element.Roll +
          "," +
          element.Present +
          "," +
          element.absent +
          "," +
          element.attendance.toFixed(2) +
          "\n";
    });

    return csvStr;
  };

  const Downloade = async (item) => {
    setOverlayVisible(true);
    let temp = "";
    route.params.info.Data.SubjectName.split(" ").map((i) => {
      temp += i;
    });
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let filename =
      FileSystem.documentDirectory + `Class(${temp}).csv`.toString();
    await FileSystem.writeAsStringAsync(filename, JsonToCSV(item)).then(() => {
      //alert("done");
    });
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(filename);

      await MediaLibrary.createAlbumAsync("class360", asset, false).then(
        (data) => {
          setOverlayVisible(false);
          alert(`File saved at ${asset.uri}`);
        }
      );
    }

    //alert(temp);
  };

  useEffect(() => {
    getdata();
    //console.log(data);
    // JsonToCSV(route.params.info.Data.Student);
  }, []);

  return (
    <>
      <Overlay visible={overlayVisible} p="xl">
        <Div flexWrap="wrap" row>
          <Image
            style={{ width: 70, height: 70 }}
            source={require("../../assets/animations/download.gif")}
          />
          <Text ml="md" fontWeight="bold">
            Downloading...
          </Text>
        </Div>
      </Overlay>
      <ScrollView>
        {data.length != 0 ? (
          data.map((i) => (
            <Div alignItems="center">
              <Div
                w={"90%"}
                bg="gray200"
                mt="lg"
                justifyContent="space-between"
                row
              >
                <Div row>
                  <Div
                    h={50}
                    w={50}
                    rounded="circle"
                    bg="teal200"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {/* <CircularProgress
                      value={i.ClassAttendance.toFixed(0)}
                      radius={30}
                      inActiveStrokeColor={"#81e6d9"}
                      inActiveStrokeOpacity={0.4}
                      activeStrokeColor={"#38b2ac"}
                      activeStrokeWidth={10}
                      textColor={"#718096"}
                      valueSuffix={"%"}
                    /> */}

                    <Text fontWeight="bold">
                      {i.ClassAttendance.toFixed(0)}%
                    </Text>
                  </Div>

                  <Text fontWeight="bold" color="gray800" ml="lg" fontSize="md">
                    {" "}
                    <Text fontSize="xl" color="gray500">
                      Class Attendance
                    </Text>
                    {"\n"}
                    <Text fontSize="xl">{i.Roll}</Text>
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
                        {i.Absent}
                      </Text>{" "}
                    </Text>{" "}
                  </Text>
                </Div>
                <Div alignItems="center">
                  <Button
                    loading={isloading}
                    bg="gray600"
                    h={40}
                    w={40}
                    rounded="circle"
                    onPress={() => {
                      Downloade(i);
                    }}
                  >
                    <Icon
                      name="download"
                      fontFamily="MaterialCommunityIcons"
                      fontSize={24}
                      color="white"
                      h={60}
                      w={60}
                      rounded="md"
                    />
                  </Button>
                  {/* <Text fontSize="xs">download</Text> */}
                </Div>
              </Div>
              <Div>
                <Text color="gray500">Absent</Text>
                <Div w={"55%"} flexWrap="wrap" row>
                  {i.AbsentData.length != 0 ? (
                    i.AbsentData.map((n) => (
                      <Div
                        w={25}
                        h={22}
                        m="xs"
                        justifyContent="center"
                        alignItems="center"
                        bg="gray600"
                        rounded="md"
                      >
                        <Text color="white" fontWeight="bold">
                          {" "}
                          {n.Roll}
                        </Text>
                      </Div>
                    ))
                  ) : (
                    <Text fontWeight="bold" color="gray500">
                      No absent Students
                    </Text>
                  )}
                </Div>
                <Text color="gray500">Present</Text>
                <Div w={"55%"} flexWrap="wrap" row>
                  {i.PresentData.length != 0 ? (
                    i.PresentData.map((n) => (
                      <Div
                        w={25}
                        h={22}
                        m="xs"
                        rounded="md"
                        justifyContent="center"
                        alignItems="center"
                        bg="teal400"
                      >
                        <Text color="white"> {n.Roll}</Text>
                      </Div>
                    ))
                  ) : (
                    <Text fontWeight="bold" color="gray500">
                      No Present Students
                    </Text>
                  )}
                </Div>
                <Div mt="xl" row>
                  <Button
                    px="md"
                    py="sm"
                    mr="sm"
                    color="black"
                    bg="#e2e8f0"
                    alignItems="center"
                    rounded="circle"
                    shadow={2}
                    prefix={
                      <MaterialIcons
                        name="date-range"
                        size={16}
                        color="black"
                      />
                    }
                  >
                    <Text
                      fontFamily="RobotoMedium"
                      fontWeight="bold"
                      ml="xs"
                      color="#718096"
                    >
                      {i.date}
                    </Text>
                  </Button>
                  <Button
                    px="md"
                    py="sm"
                    mr="sm"
                    ml="xs"
                    color="black"
                    bg="#e2e8f0"
                    alignItems="center"
                    rounded="circle"
                    shadow={2}
                    prefix={
                      <Ionicons name="time-outline" size={16} color="black" />
                    }
                  >
                    <Text
                      fontFamily="RobotoMedium"
                      fontWeight="bold"
                      ml="xs"
                      color="#718096"
                    >
                      {i.Time}
                    </Text>
                  </Button>
                </Div>
              </Div>

              <Div w={"90%"} h={1} bg="gray400" m="xl"></Div>
            </Div>
          ))
        ) : (
          <Div
            h={"100%"}
            w={"100%"}
            justifyContent="center"
            alignItems="center"
          >
            <LottieView
              style={{ width: 300, height: 300 }}
              source={require("../../assets/animations/empty.json")}
              autoPlay={true}
              loop={false}
            />
            {/* <Image
              style={{ width: 70, height: 70 }}
              source={require("../assets/animations/loading.gif")}
            /> */}
          </Div>
        )}
      </ScrollView>
    </>
  );
}
