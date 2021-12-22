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
  SafeAreaView,
} from "react-native";
import { useForm, Controller, set } from "react-hook-form";
import { useWindowDimensions, CheckBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import BottomSheet from "reanimated-bottom-sheet";
import Animated, { concat } from "react-native-reanimated";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

import { Timetableuser } from "../../firebase";

export default function ({ route, navigation }) {
  const [Local, setLocal] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [records, setrecords] = useState([]);
  const [data, setdata] = useState([]);
  const [fontsLoaded, setfontsLoaded] = useState(true);
  const [branch, setBranch] = useState("Lucky");
  const [Live, setLive] = useState([]);
  const [Branchs, setBranchs] = useState([]);
  const [state, setstate] = useState("");
  const [doremon, setdoremon] = useState([]);
  const { height, width } = useWindowDimensions();

  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        ToastAndroid.showWithGravityAndOffset(
          "invalide link",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      }
    }, [url]);

    return (
      <Button
        title={children}
        onPress={handlePress}
        px="md"
        py="sm"
        mr="lg"
        mt="lg"
        bg="blue500"
        rounded="circle"
        color="white"
        suffix={
          <Feather name="arrow-right-circle" mt="xs" size={19} color="white" />
        }
        shadow={"lg"}
      >
        <Text fontWeight="bold" color="white">
          Attend session{"\t"}
        </Text>
      </Button>
    );
  };

  const deletdata = (id) => {
    Timetableuser.doc(id)
      .delete()
      .then((res) => {
        alert("Item removed from database");
        setivedata();
        getTiemtabledata();
      });
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      RobotoMedium: require("../../assets/fonts/Roboto/Roboto-Medium.ttf"),
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
  const TData = [];
  let Branch = [];
  let b = [];
  const getTiemtabledata = () => {
    setRefreshing(true);
    Timetableuser.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((res) => {
        TData.push({ Data: res.data(), id: res.id });
        b.push(res.data().Branch);
      });
      setdoremon(TData);
      setBranchs(multiDimensionalUnique(b));
      setRefreshing(false);
    });

    return TData;
  };
  const setivedata = () => {
    if (doremon.length != 0) {
      doremon.map((k) => {
        if (k.Branch == branch) {
          k.Data.map((h) => {
            if (h.day == Days[new Date().getDay() - 1]) {
              h.items.map((l) => {
                if (l.state == "offline") {
                  //setLive(Live.concat(l))
                } else {
                  setLive([]);
                }
              });
            }
          });
        }
      });
    }
  };
  let Days = [
    "Monday",
    "Tuseday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let status = "offline";

  function getDate(year, month, day, hours, minutes, str) {
    if (str.toLowerCase() == "pm" && hours > 12) {
      hours = hours + 12;
    }

    return new Date(year, month, day, hours, minutes, 0, 0);
  }

  const compareTime = (startTime, endTime) => {
    const currentTime = new Date(
      2021,
      9,
      30,
      new Date().getHours(),
      new Date().getMinutes(),
      new Date().getSeconds(),
      new Date().getMilliseconds()
    );

    if (
      currentTime.getTime() >= startTime.getTime() &&
      currentTime.getTime() <= endTime.getTime()
    ) {
      setTimeout(() => {
        setivedata();
        doremon.map((i) => {
          i.Data.map((j) => {
            if (j.day == Days[new Date().getDay() - 1]) {
              j.items.map((item) => {
                item["state"] = "offline";
              });
            }
          });
        });
      }, endTime.getTime() - currentTime.getTime());
      return (status = "online");
    }

    return (status = "offline");
  };

  const [copiedText, setCopiedText] = useState("");

  const copyToClipboard = (sessionlink) => {
    if (sessionlink) {
      Clipboard.setString(sessionlink);
      ToastAndroid.showWithGravityAndOffset(
        "Link copied",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };

  {
    doremon.length != 0
      ? doremon.map((i) => {
          i.Data.Data.map((j) => {
            if (j.day == Days[new Date().getDay() - 1]) {
              j.items.map((item) => {
                item["state"] = compareTime(
                  getDate(
                    2021,
                    9,
                    30,
                    Number(item.stime),
                    Number(item.smtime),
                    item.sdn
                  ),
                  getDate(
                    2021,
                    9,
                    30,
                    Number(item.etime),
                    Number(item.emtime),
                    item.sdn
                  )
                );
              });
            }
          });
        })
      : null;
  }

  useEffect(() => {
    setivedata();
    getTiemtabledata();
  }, []);

  return (
    <>
      <ScrollView
        style={{ marginTop: "3%" }}
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              getTiemtabledata();
              setivedata();
            }}
          />
        }
      >
        <View
          style={{
            flexDirection: "row",

            justifyContent: "flex-start",
            marginLeft: "4%",
            marginBottom: "3%",
          }}
        >
          {doremon.length != 0 ? (
            <>
              <Button
                px="xl"
                py="md"
                mr="md"
                bg="white"
                rounded="circle"
                color="white"
                prefix={<AntDesign name="book" size={15} color="black" />}
                shadow={10}
                onPress={() => {
                  getalldata();
                }}
              >
                <Text fontWeight="bold" color="#4a5568">
                  {"\t"}
                  {branch ? branch : null}
                </Text>
              </Button>
              <Button
                px="md"
                py="sm"
                mr="lg"
                bg="white"
                rounded="circle"
                color="white"
                onPress={() => {
                  let id = "";
                  if (branch) {
                    id = doremon.filter((j) => j.Data.Branch == branch)[0].id;
                  } else {
                    id = doremon[0].id;
                  }

                  Alert.alert(
                    "Delete Record",
                    `Are you sure ! you want to delete ${id}this record `,
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: () => {
                          deletdata(id);
                        },
                      },
                    ]
                  );
                }}
                shadow={"lg"}
              >
                <AntDesign name="delete" size={19} color="black" />
              </Button>
            </>
          ) : null}
          <Button
            px="md"
            py="sm"
            mr="lg"
            bg="white"
            rounded="circle"
            color="black"
            prefix={
              <Ionicons name="ios-add-circle-outline" size={20} color="black" />
            }
            onPress={() => {
              navigation.navigate("Create");
            }}
            shadow={"lg"}
          ></Button>
        </View>

        {Local.length != 0 ? (
          <ScrollView style={{ marginTop: "5%" }}>
            {Local.Data.map((i) => (
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                <View style={{ height: 250 }}>
                  <Div row>
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color="black"
                      ml="lg"
                      mb="md"
                    >
                      <Ionicons
                        name="today-outline"
                        size={20}
                        color="#4299e1"
                      />
                      {"\t"}
                      {i.day}{" "}
                      <Text color="gray500">
                        {" "}
                        ( Updated at 13-6-2021 ){"\t"}
                        {"\t"}
                      </Text>
                    </Text>
                  </Div>
                  {i.items != 0 ? (
                    <ScrollView
                      showsVerticalScrollIndicator={true}
                      horizontal={true}
                      style={{ height: "35%", marginTop: "3%" }}
                    >
                      {i.items.map((n) => (
                        <View
                          style={{
                            width: width - 40,
                            height: 200,
                            marginLeft: 5,
                            //borderColor: n.selected ? '#ff9d9d' : '#c2f5d0',
                            borderWidth: 2,
                            borderColor: "#cbd5e0",
                            borderRadius: 10,
                            color: "black",
                          }}
                        >
                          <View
                            style={{
                              height: "25%",
                              width: "100%",
                              flexDirection: "row",
                              flexWrap: "wrap",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              fontSize="xl"
                              fontWeight="bold"
                              color="black"
                              mt="lg"
                              ml="xl"
                            >
                              <MaterialCommunityIcons
                                name="text-subject"
                                size={20}
                                color="black"
                              />
                              {n.Subject}
                            </Text>
                            <Button
                              px="md"
                              py="sm"
                              mr="md"
                              mt="lg"
                              bg={n.state == "online" ? "#68d391" : "#a0aec0"}
                              rounded="circle"
                              color="white"
                              shadow={2}
                            >
                              <Text fontWeight="bold" color="white">
                                {n.state}
                              </Text>
                            </Button>
                          </View>

                          <Button
                            w={170}
                            px="sm"
                            py="sm"
                            mr="sm"
                            mt="xs"
                            ml="lg"
                            alignItems="center"
                            bg="#4299e1"
                            rounded="circle"
                            color="white"
                            shadow={2}
                            prefix={
                              <Ionicons
                                name="time-outline"
                                size={16}
                                color="white"
                              />
                            }
                          >
                            <Text fontWeight="bold" color="white">
                              {"\t"}
                              {n.stime}:{n.smtime} {n.sdn} - {n.etime}:
                              {n.emtime} {n.edn}
                            </Text>
                          </Button>

                          {n.type && n.Discriptions ? (
                            <Text color="#a0aec0" mt="md" ml="lg" p="xs">
                              {n.type} by{" "}
                              <Text fontWeight="bold" color="#4a5568">
                                {n.Name}{" "}
                              </Text>
                              {"\t"}
                              {"\n"}
                              <Text fontWeight="bold" color="#4a5568">
                                {" "}
                                Discription:
                                <Text color="#a0aec0"> {n.Discriptions}</Text>
                              </Text>
                            </Text>
                          ) : null}

                          <Div ml={"3%"} row>
                            <Button
                              px="md"
                              py="sm"
                              mr="md"
                              mt="lg"
                              bg="#cbd5e0"
                              rounded="circle"
                              color="white"
                              shadow={2}
                              onPress={() => copyToClipboard(n.Link)}
                            >
                              <Text fontWeight="bold" color="white">
                                Copy link
                              </Text>
                            </Button>
                            <OpenURLButton url={n.Link}> jdsbfh</OpenURLButton>
                            <Button
                              px="md"
                              py="sm"
                              mr="lg"
                              mt="lg"
                              bg="#cbd5e0"
                              rounded="circle"
                              color="white"
                              onPress={() => {
                                if (n.Link) {
                                  Alert.alert("session link", `${n.Link}`, [
                                    {
                                      text: "open",
                                      onPress: () =>
                                        console.log("Cancel Pressed"),
                                      style: "cancel",
                                    },
                                    {
                                      text: "ok",
                                      onPress: () => {},
                                    },
                                  ]);
                                } else {
                                  alert("url not found");
                                }
                              }}
                              shadow={2}
                            >
                              <Feather name="link-2" size={19} color="black" />
                            </Button>
                          </Div>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <View
                      style={{
                        width: width - 40,
                        height: "90%",
                        marginLeft: 5,
                        borderColor: "#cbd5e0",
                        borderRadius: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        color: "black",
                      }}
                    >
                      <View>
                        <Image
                          style={{ width: 88, height: 88 }}
                          source={{
                            uri: "https://img.icons8.com/cotton/2x/4a90e2/add-database.png",
                          }}
                        />
                        <Button
                          mt="lg"
                          px="xl"
                          py="md"
                          bg="#cbd5e0"
                          rounded="circle"
                          color="white"
                          onPress={() => {
                            navigation.navigate("Home");
                          }}
                          shadow={2}
                        >
                          Add data
                        </Button>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Image
            style={{ width: 300, height: 300 }}
            source={require("../assets/wellcom.png")}
          />
        )}
      </ScrollView>

      <Fab
        bg="#edf2f7"
        color="black"
        icon={
          <MaterialCommunityIcons
            name="filter-minus-outline"
            size={23}
            color="black"
          />
        }
        h={50}
        w={50}
        p={0}
      >
        {Branchs.map((k) => (
          <Button
            p="none"
            bg="transparent"
            justifyContent="flex-end"
            onPress={() => {
              setBranch(k);
              if (doremon) {
                setLocal(doremon.filter((j) => j.Data.Branch == k)[0].Data);
                //console.log(doremon.filter((j) => j.Data.Branch == k)[0].Data);
              }
            }}
          >
            <Div rounded="xl" bg="white" px={"lg"} py={"md"}>
              <Text fontSize="md" fontWeight="bold">
                {k} <AntDesign name="export" size={16} color="black" />
              </Text>
            </Div>
          </Button>
        ))}
      </Fab>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "7%",
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    margin: "3%",
  },
});
