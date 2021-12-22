import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";

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
import { useForm, Controller } from "react-hook-form";
import { useWindowDimensions, CheckBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import BottomSheet from "reanimated-bottom-sheet";
import Animated, { concat } from "react-native-reanimated";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";

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

import * as Font from "expo-font";

export default function ({ route, navigation }) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [records, setrecords] = useState([]);
  const [Adata, Asetdata] = useState([]);
  const [fontsLoaded, setfontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      RobotoMedium: require("../../assets/fonts/Roboto/Roboto-Black.ttf"),
      RobotoLight: require("../../assets/fonts/Roboto/Roboto-Light.ttf"),
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

  const read = async () => {
    setRefreshing(true);
    let record = [];
    await FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
      (data) => {
        if (data.filter((j) => j.split(".")[1] != "csv").length != 0) {
          setrecords(eval(JSON.stringify(data)));
          eval(JSON.stringify(data)).map(async (i) => {
            await FileSystem.readAsStringAsync(
              FileSystem.documentDirectory + i
            ).then((Data) => {
              if (eval(JSON.parse(Data)).name) {
                console.log(eval(JSON.parse(Data)).name);
              } else {
                record.push(JSON.parse(Data));
              }
            });
            Asetdata(multiDimensionalUnique(record));
            setRefreshing(false);
          });
        } else {
          Asetdata([]);
          setRefreshing(false);
        }
      }
    );
  };

  const Delete = (id) => {
    FileSystem.deleteAsync(FileSystem.documentDirectory + id).then(() => {
      read();
    });
  };

  useEffect(async () => {
    read();
    loadFonts();
    // try {
    //   const jsonValue = await AsyncStorage.getItem("@App_state");
    //   alert(jsonValue);
    // } catch (e) {
    //   alert(e);
    // }
  }, []);

  return (
    <>
      {/* attendance header */}

      {fontsLoaded ? (
        Adata.length != 0 ? (
          <ScrollView
            style={{
              backgroundColor: "#fff",
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={read} />
            }
          >
            {/* attendance header */}
            {/* attendance dashboard */}

            {/*records.map((n) => (
          <Div m="md">
            <Div row>
              <Div w={50} h={50} bg="red" mr="xl"></Div>
              <Text>{n}</Text>
            </Div>
          </Div>
        ))*/}
            <Div alignItems="center">
              {Adata.length != 0
                ? multiDimensionalUnique(Adata).map((i, index) => (
                    <Div
                      w={"98%"}
                      bg="#ffff"
                      mt="sm"
                      shadow="md"
                      pt="md"
                      pb="md"
                      mb="lg"
                      rounded="md"
                    >
                      <Div justifyContent="space-between" row>
                        <Div m="lg" row>
                          <MaterialCommunityIcons
                            name="text-subject"
                            size={20}
                            color="black"
                            mt="xs"
                          />
                          <Text
                            fontWeight="bold"
                            fontFamily="RobotoMedium"
                            fontSize="xl"
                            mb="xs"
                          >
                            {" "}
                            {i.SubjectName}
                          </Text>
                        </Div>

                        <Div row>
                          <Button
                            px="lg"
                            py="xs"
                            mr="md"
                            mt="md"
                            bg="#bee3f8"
                            rounded="circle"
                            color="white"
                            shadow={2}
                          >
                            <Text
                              fontWeight="bold"
                              fontFamily="RobotoMedium"
                              color="black"
                            >
                              {i.Type}
                            </Text>
                          </Button>
                        </Div>
                      </Div>
                      <Div flexWrap="wrap" row>
                        <Button
                          px="md"
                          py="sm"
                          mr="sm"
                          ml="lg"
                          color="black"
                          bg="#e2e8f0"
                          alignItems="center"
                          rounded="circle"
                          shadow={2}
                          prefix={
                            <Feather
                              name="git-branch"
                              size={16}
                              color="black"
                            />
                          }
                        >
                          <Text
                            fontFamily="RobotoMedium"
                            fontWeight="bold"
                            color="#718096"
                          >
                            {"\t"}
                            {i.department}
                            {"\t"}
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
                            <AntDesign name="book" size={16} color="black" />
                          }
                        >
                          <Text
                            fontFamily="RobotoMedium"
                            fontWeight="bold"
                            color="#718096"
                          >
                            {"\t"}
                            {i.Division}
                            {"\t"}
                          </Text>
                        </Button>
                        {/* <Icon
                        name="pushpino"
                        fontFamily="AntDesign"
                        fontSize={18}
                        color="teal500"
                        bg="blue500"
                        h={25}
                        w={25}
                        ml="xs"
                        bg="teal100"
                        rounded="md"
                      /> */}
                      </Div>
                      <Div m="lg" flexWrap="wrap" row>
                        <Button
                          bg="#cbd5e0"
                          h={33}
                          w={33}
                          rounded="circle"
                          p={0}
                          onPress={() => {
                            navigation.navigate("Update", {
                              Data: i,
                              id: records[index],
                            });
                          }}
                        >
                          <MaterialCommunityIcons
                            name="circle-edit-outline"
                            size={19}
                            color="black"
                          />
                        </Button>
                        <Button
                          bg="#cbd5e0"
                          h={33}
                          w={33}
                          rounded="circle"
                          p={0}
                          ml="md"
                          onPress={() => {
                            navigation.navigate("View", {
                              Data: i,
                              id: records[index],
                            });
                            //navigation.navigate("View");
                          }}
                        >
                          <AntDesign name="export" size={19} color="black" />
                        </Button>
                        <Button
                          bg="#fed7d7"
                          h={33}
                          w={33}
                          rounded="circle"
                          p={0}
                          ml="md"
                          onPress={() => {
                            Delete(records[index]);
                          }}
                        >
                          <AntDesign name="delete" size={19} color="#f56565" />
                        </Button>
                        <Button
                          px="md"
                          py="sm"
                          mr="sm"
                          ml="lg"
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
                            <Ionicons
                              name="time-outline"
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
                            {i.time}
                          </Text>
                        </Button>
                      </Div>
                    </Div>
                  ))
                : null}
            </Div>
          </ScrollView>
        ) : (
          <Div w={"100%"} h={"100%"}>
            {/* <LottieView
              source={require("../../assets/animations/13697-archive.json")}
              autoPlay={true}
              loop={false}
            /> */}
          </Div>
        )
      ) : null}

      {/* attendance dashboard */}
      {/* create attendance ,.... */}
      <Button
        bg="#bee3f8"
        position="absolute"
        top={"90%"}
        left={"80%"}
        h={50}
        p={0}
        shadow="lg"
        w={50}
        rounded="circle"
        ml="md"
        onPress={() => {
          navigation.navigate("Create");
          //read();
        }}
      >
        <Entypo name="plus" size={24} color="#2b6cb0" />
      </Button>
      {/* create attendance ,.... */}
    </>
  );
}
