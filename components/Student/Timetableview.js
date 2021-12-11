import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  Image,
  TouchableHighlight,
  Alert,
  Linking,
  SafeAreaView,
  Clipboard,
  ToastAndroid,
  RefreshControl,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWindowDimensions } from "react-native";
import { useFonts } from "expo-font";
import {
  Toggle,
  Icon,
  Button,
  Div,
  ThemeProvider,
  Radio,
  Text,
  Dropdown,
  Input,
  Fab,
  Snackbar,
  SnackbarRef,
} from "react-native-magnus";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//icon
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

function removeDuplicateObjectFromArray(array, key) {
  let check = {};
  let res = [];
  for (let i = 0; i < array.length; i++) {
    if (!check[array[i][key]]) {
      check[array[i][key]] = true;
      res.push(array[i]);
    }
  }
  return res;
}

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

export default function ({ navigation }) {
  const [Local, setLocal] = useState([]);
  const [doremon, setdoremon] = useState([]);
  const [Branchs, setBranchs] = useState([]);
  const { height, width } = useWindowDimensions();
  const [branch, setBranch] = useState("");
  const [Live, setLive] = useState([]);
  const [MLive, setMLive] = useState([]);
  const [state, setstate] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);

  let lhour = 8;
  let lmin = 0;
  let lam_pm = "PM";

  let ehour = 8;
  let emin = 14;
  let eam_pm = "PM";

  let flag = "offline";
  let LLst = "";
  let Days = [
    "Monday",
    "Tuseday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let status = "offline";

  let Branch = [];
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

  const getalldata = () => {
    setRefreshing(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://us-central1-class360-303e1.cloudfunctions.net/app",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        //console.log(result);
        setdoremon(result);
        if (branch) {
          if (doremon.length != 0) {
            setLocal(doremon.filter((u) => u.Branch == branch)[0].Data);
          }
        }
        setRefreshing(false);
        result.map((i) => {
          Branch.push(i.Branch);
        });

        setBranchs(multiDimensionalUnique(Branch));
      })
      .catch((error) => console.log("error", error));
  };

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
        getalldata();
        setivedata();
        setRefreshing(true);

        doremon.map((i) => {
          if (typeof i.Data != "undefined") {
            i.Data.map((j) => {
              if (j.day == Days[new Date().getDay() - 1]) {
                j.items.map((item) => {
                  item["state"] = "offline";
                });
              }
            });
          }
        });
      }, endTime.getTime() - currentTime.getTime());
      return (status = "online");
    }

    return (status = "offline");
  };

  function getDate(year, month, day, hours, minutes, str) {
    if (str.toLowerCase() == "pm") {
      hours = hours + 12;
      if (hours == 24) {
        hours = 0;
      }
    }
    return new Date(year, month, day, hours, minutes, 0, 0);
  }

  let currentTime = new Date(
    2021,
    9,
    31,
    new Date().getHours(),
    new Date().getMinutes(),
    new Date().getSeconds(),
    new Date().getMilliseconds()
  );

  {
    doremon.length != 0
      ? doremon.map((i) => {
          i.Data.map((j) => {
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

  const setivedata = () => {
    getalldata();

    if (doremon.length != 0) {
      doremon.map((k) => {
        if (k.Branch == branch) {
          k.Data.map((h) => {
            if (h.day == Days[new Date().getDay() - 1]) {
              h.items.map((l) => {
                if (l.state == "online") {
                  setLive(l);
                  console.log(l);
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

  //getalldata()

  const deletdata = (id) => {
    //console.log(id)
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
      id: id,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(
      "https://us-central1-class360-303e1.cloudfunctions.net/app/delete",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        alert(result);
        getalldata();
        setivedata();
      })
      .catch((error) => console.log("error", error));
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

  useEffect(() => {
    getalldata();
    setivedata();
  }, []);

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              getalldata();
              setivedata();
            }}
          />
        }
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            backgroundColor: "#4299e1",
            marginBottom: "3%",
            borderBottomRightRadius: 10,
            borderBottomStartRadius: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "2%",
              margin: "3%",
            }}
          ></View>

          {Live.length != 0 ? (
            <View
              style={{
                width: width - 20,
                height: 200,
                marginLeft: "2%",
                //borderColor: n.selected ? '#ff9d9d' : '#c2f5d0',
                //borderWidth: 2,
                //borderColor: '#cbd5e0',
                borderRadius: 10,
                color: "black",
                marginTop: "2%",
                backgroundColor: "#67aeeb",
                backdropfilter: "blur(0) saturate(200%)",
                //-webKitbackdropfilter: 'blur(0) saturate(200%)',
                backgrCoundcolor: "rgba(255, 255, 255, 0.36)",
                // border: '1px solid #cbd5e0',
              }}
            >
              <View
                style={{
                  height: "25%",
                  width: "100%",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  zIndex: 10,
                }}
              >
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color="white"
                  mt="lg"
                  ml="xl"
                >
                  {Live.Subject}
                </Text>
                <Button
                  px="md"
                  py="sm"
                  mr="md"
                  mt="lg"
                  bg="#63b3ed"
                  rounded="circle"
                  color="white"
                  shadow={2}
                >
                  <Text fontWeight="bold" color="white">
                    {Live.type}
                  </Text>
                </Button>
              </View>

              <Div
                w={160}
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
              >
                <Text fontWeight="bold" color="white">
                  {Live.stime}:{Live.smtime} {Live.sdn} - {Live.etime}:
                  {Live.emtime} {Live.edn}
                </Text>
              </Div>
              <Div row>
                <Button
                  px="lg"
                  py="xs"
                  ml="lg"
                  mt="lg"
                  bg="white"
                  rounded="circle"
                  color="white"
                  shadow={10}
                  onPress={() => {
                    getalldata();
                  }}
                >
                  <Text fontWeight="bold" color="#4a5568">
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor:
                          state == "online" ? "#68d391" : "#e2e8f0",
                        borderRadius: 10,
                      }}
                    />{" "}
                    {Live.state}
                  </Text>
                </Button>
              </Div>
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
                  onPress={() => {
                    //getalldata();
                    gettime();
                  }}
                >
                  <Text fontWeight="bold" color="white">
                    Copy link
                  </Text>
                </Button>

                <Button
                  px="md"
                  py="sm"
                  mr="lg"
                  mt="lg"
                  bg="blue500"
                  rounded="circle"
                  color="white"
                  suffix={
                    <Feather
                      name="arrow-right-circle"
                      mt="xs"
                      size={19}
                      color="white"
                    />
                  }
                  shadow={"lg"}
                >
                  <Text fontWeight="bold" color="white">
                    Attend session{"\t"}
                  </Text>
                </Button>

                <Button
                  px="md"
                  py="sm"
                  mr="lg"
                  mt="lg"
                  bg="white"
                  rounded="circle"
                  color="white"
                  onPress={() => {
                    Alert.alert("session link", Live.Link, [
                      {
                        text: "open",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "ok",
                        onPress: () => {},
                      },
                    ]);
                  }}
                  shadow={"lg"}
                >
                  <Feather name="link-2" size={19} color="black" />
                </Button>
              </Div>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: "row",

              marginLeft: "4%",
              marginBottom: "2%",

              width: "100%",
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
                  px="xl"
                  py="sm"
                  ml="md"
                  bg="white"
                  rounded="circle"
                  color="white"
                  shadow={10}
                  prefix={
                    <Ionicons
                      name="ios-refresh-circle-outline"
                      size={19}
                      color="black"
                    />
                  }
                  onPress={() => {
                    getalldata();
                    setivedata();
                  }}
                >
                  <Text fontWeight="bold" color="#4a5568">
                    {"\t"}Refresh
                  </Text>
                </Button>
              </>
            ) : null}
          </View>
        </View>

        {Branchs.length != 0 ? (
          <ScrollView>
            {Local.map((i) => (
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
                              {n.type} conducting by{" "}
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
                        width: width - 20,
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
        ) : null}
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
                setLocal(doremon.filter((j) => j.Branch == k)[0].Data);
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
