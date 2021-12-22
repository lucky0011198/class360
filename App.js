import React, { useState, useEffect, useCallback, useContext } from "react";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(true); //Ignore all log notifications
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Linking,
  ToastAndroid,
  Clipboard,
  RefreshControl,
  FlatList,
} from "react-native";
import { useWindowDimensions } from "react-native";
import Constants from "expo-constants";
import { NavigationContainer } from "@react-navigation/native";
import BottomSheet from "reanimated-bottom-sheet";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Contextdata } from "./components/context";
import Timetabledata from "./components/context";
import AttendanceScreen from "./components/Attendance/Home";
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
  Checkbox,
  Text,
  Tag,
} from "react-native-magnus";

import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  Foundation,
  AntDesign,
  Ionicons,
  FontAwesome,
  Entypo,
} from "@expo/vector-icons";

import { auth, storage, User, Timetableuser, Users } from "./firebase";

//screeens...
import TimetableScreen from "./components/TimeTable/main";
import NoticeScreen from "./components/Notice";
import MainScreen from "./components/Auth/Main";
import LoginScreen from "./components/Auth/Login";
import Svg, { Circle, SvgUri } from "react-native-svg";
import UpdateScreen from "./components/Attendance/update";
import StudentScreen from "./components/Attendance/Student";
import ClassScreen from "./components/Attendance/Class";
import ViewScreen from "./components/Attendance/View";
import TempletScreen from "./components/Attendance/Templet";
import CreateScreen from "./components/Attendance/Create";

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

function HomeScreen({ route, navigation }) {
  const [Live, setLive] = useState([]);
  const [user, setuser] = useState([]);
  const [doremon, setdoremon] = useState([]);
  const { height, width } = useWindowDimensions();
  const [Data, setData] = useState([]);
  const [TimetableData, setTimetableData] = useState([]);
  const [branch, setbranch] = useState();
  const sheetRef = React.useRef(null);
  const [notice, setnotice] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

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

  const [data, setdata] = useState([
    {
      name: "Attendance",
      path: "Attendance",
      link: "https://img.icons8.com/cotton/128/4a90e2/multi-edit.png",
      text: "Create , Delete and Update Attendance here.  ",
    },
    {
      name: "Notice",
      path: "Notice",
      path1: "Edite",
      link: "https://img.icons8.com/cotton/128/4a90e2/notice--v1.png",
      text: "Create , Delete and Update notices here",
    },
    {
      name: "Timetable",
      path: "Timetable",
      path1: "create",
      link: "https://img.icons8.com/cotton/64/4a90e2/overtime--v1.png",
      text: "Create , Delete and Update Timetable here",
    },
  ]);
  const [option, setoption] = useState([
    {
      title: "Attendance",
      link: "https://img.icons8.com/cotton/128/4a90e2/multi-edit.png",
    },
    {
      title: "Notice",
      link: "https://img.icons8.com/cotton/128/4a90e2/notice--v1.png",
    },
    {
      title: "Xerox",
      link: "https://img.icons8.com/wired/64/4a90e2/scanner.png",
    },
    {
      title: "Timtable",
      link: "https://img.icons8.com/cotton/64/4a90e2/overtime--v1.png",
    },
    {
      title: "Profile",
      link: "https://img.icons8.com/cotton/64/4a90e2/user-male-circle.png",
    },
    {
      title: "Logged-in user",
      link: "https://img.icons8.com/cotton/64/4a90e2/groups.png",
    },
  ]);
  const TData = [];
  const Branch = [];

  const getTiemtabledata = () => {
    Timetableuser.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((res) => {
        TData.push({ Data: res.data(), id: res.id });
      });
      setdoremon(TData);
      if (branch) {
        if (doremon.length != 0) {
          setLocal(doremon.filter((u) => u.Branch == branch)[0].Data);
        }
      }
      setRefreshing(false);
    });
    return TData;
  };
  const setivedata = () => {
    if (doremon.length != 0) {
      doremon.map((k) => {
        if (k.Branch == "Eln") {
          k.Data.map((h) => {
            if (h.day == "Monday") {
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
            if (j.day == "Monday") {
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

  let LievData = [];

  const getlivelectures = () => {
    doremon.length != 0
      ? doremon.map((k) => {
          k.Data.Branch == "Eln"
            ? k.Data.Data.map((i) => {
                i.day == "Monday"
                  ? i.items.map((n) => {
                      LievData.push(n);
                    })
                  : null;
                setLive(LievData);
              })
            : null;
        })
      : null;
  };

  const getuser = () => {
    if (user) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        Users.onSnapshot((querySnapshot) => {
          querySnapshot.forEach((res) => {
            try {
              if (user.uid == res.id) {
                setuser(res.data());
              }
            } catch (e) {
              console.log(e);
            }
          });
        });
      });
    }
  };

  const loaddata = () => {
    let temp = [];
    setRefreshing(true);
    User.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((res) => {
        temp.push({ Data: res.data(), id: res.id });
      });
      setnotice(temp);
      setRefreshing(false);
    });
  };
  const renderItem = ({ item }) => {
    return (
      <Div
        w={width - 20}
        borderRadius={10}
        shadow="md"
        ml="2.5%"
        mt="lg"
        mb="xl"
        backgroundColor={item.Data.Color}
      >
        <Div justifyContent="space-between" flexWrap="wrap" w="98%" row>
          <Div m="md" row>
            <Button
              bg={item.Data.Color == "#ffff" ? "#fed7d7" : "#ffff"}
              h={30}
              w={30}
              p={0}
              rounded="circle"
              onPress={() => {
                const dbRef = User.doc(item.id);
                dbRef.delete().then((res) => {
                  alert("Item removed from database");
                });
              }}
            >
              <AntDesign name="delete" size={15} color="black" />
            </Button>
          </Div>
          <Button
            px="lg"
            py="xs"
            mt="lg"
            bg="#e6fffa"
            rounded="circle"
            color="black"
            prefix={<AntDesign name="warning" size={15} color="#4fd1c5" />}
            shadow={2}
          >
            <Text fontWeight="bold" color="black">
              {"\t"}
              {item.Data.Type}
            </Text>
          </Button>
        </Div>
        <Div justifyContent="space-between" mt="lg" ml="lg" mr="lg" row>
          <Text fontWeight="bold" fontSize="xl">
            {item.Data.Title}{" "}
          </Text>
        </Div>
        <Text mt="xs" m="lg" color="gray700">
          {item.Data.Content}
        </Text>

        <Div flexWrap="wrap" row>
          {item.Data.Lables.map((k) => (
            <Tag
              bg={item.Data.Color == "#ffff" ? "#b2f5ea" : "#ffff"}
              mt={"md"}
              ml="2%"
              prefix={<Feather name="git-branch" size={15} color="black" />}
            >
              <Text>
                {"\t"}
                {k.Lable}
              </Text>
            </Tag>
          ))}
        </Div>

        {typeof item.Data.Files != "undefined" ? (
          <Div flexWrap="wrap" row>
            {item.Data.Files.map((j) => (
              <Tag
                bg={item.Data.Color == "#ffff" ? "#b2f5ea" : "#ffff"}
                mt={"md"}
                ml="2%"
                mb="lg"
                onPress={() => {
                  WebBrowser.openBrowserAsync(j.url);
                }}
                prefix={<AntDesign name="filetext1" size={15} color="black" />}
              >
                <Text>
                  {"\t"}
                  {j.Name}
                </Text>
              </Tag>
            ))}
          </Div>
        ) : null}
      </Div>
    );
  };

  useEffect(() => {
    getuser();
    loaddata();
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Main");
      })
      .catch((error) => alert(error.message));
  };
  return (
    <>
      <View
        style={{
          marginTop: "10%",
          width: "100%",
          height: "100%",
          alignItems: "center",
        }}
      >
        <Div h={"16%"} mb={"3%"} w={"90%"} style={{ borderRadius: 8 }} row>
          <View
            style={{
              width: "20%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              rounded="circle"
              source={{
                uri: "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/256/000000/external-user-interface-kiranshastry-gradient-kiranshastry.png",
              }}
              style={{ width: 50, height: 50 }}
            />
          </View>

          <View
            style={{
              justifyContent: "center",
              flexDirection: "column",
              flexWrap: "wrap",
              width: "70%",
              alignItems: "center",
            }}
          >
            <Text fontWeight="bold" fontSize="3xl" mt="xs" ml="lg">
              {user.username}
              {"\n"}
              <Text mt="md" fontSize="xs" color="gray700" ml="lg">
                {user.email}
              </Text>
            </Text>

            <Button
              mt="md"
              ml="md"
              px="xl"
              py="xs"
              bg="blue500"
              rounded="circle"
              color="white"
              shadow={2}
            >
              Teacher
            </Button>
          </View>
          <Div>
            <Button
              bg="#edf2f7"
              h={40}
              w={40}
              rounded="circle"
              mr="md"
              mt="xl"
              p={0}
              onPress={handleSignOut}
            >
              <Feather name="log-out" size={24} color="black" />
            </Button>
            <Text mr="xs" fontSize="xs" color="#718096">
              {" "}
              Logout
            </Text>
          </Div>
        </Div>

        <View style={{ height: "23%", marginTop: "2%" }}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            horizontal={true}
            style={{ height: "100%" }}
          >
            {data.map((n) => (
              <View
                style={{
                  flexDirection: "row",
                  width,
                  height: "100%",
                  marginLeft: 5,
                }}
              >
                <Div
                  shadow="lg"
                  bg="white"
                  h={"90%"}
                  w={"95%"}
                  mt={10}
                  rounded="xl"
                  row
                >
                  <View
                    style={{
                      width: "60%",
                      height: "100%",
                      backgroundColor: "white",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        height: "20%",
                        margin: "2%",
                        justifyContent: "center",
                      }}
                    >
                      <Text fontWeight="bold" fontSize="4xl" mt="xs" ml="lg">
                        {n.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "90%",
                        height: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text fontSize="xs" color="gray700" ml="lg" mt="xs">
                        {n.text}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "90%",
                        height: "30%",
                        margin: "5%",
                        justifyContent: "center",
                      }}
                    >
                      <Div row>
                        <View>
                          <Button
                            bg="white"
                            borderless
                            shadow="sm"
                            h={35}
                            w={35}
                            ml={10}
                            mt={10}
                            p={0}
                            rounded="circle"
                            alignSelf="center"
                            onPress={() => {
                              navigation.navigate(n.path);
                            }}
                          >
                            <MaterialCommunityIcons
                              name="database-edit"
                              size={20}
                              color="#7f9cf5"
                            />
                          </Button>
                          <Text color="gray500" fontSize="xs" mt={2}>
                            {" "}
                            Database
                          </Text>
                        </View>
                        <View>
                          <Button
                            bg="white"
                            borderless
                            shadow="sm"
                            h={35}
                            w={35}
                            ml={10}
                            mt={10}
                            p={0}
                            rounded="circle"
                            alignSelf="center"
                            onPress={() => {
                              navigation.navigate(n.path, { screen: n.path1 });
                            }}
                          >
                            <Entypo
                              name="circle-with-plus"
                              size={20}
                              color="#7f9cf5"
                            />
                          </Button>
                          <Text color="gray500" fontSize="xs" mt={2} ml={10}>
                            {" "}
                            Add data
                          </Text>
                        </View>
                      </Div>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      height: "100%",
                      opacity: 0.6,
                      backgroundColor: "#bee3f8",
                      borderTopRightRadius: 10,
                      borderBottomRightRadius: 10,
                      borderTopLeftRadius: 60,
                      borderBottomLeftRadius: 60,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{
                        uri: n.link,
                      }}
                      style={{ width: 60, height: 60 }}
                    />
                  </View>
                </Div>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={{ height: "23%", marginTop: "2%" }}>
          <Div ml="lg" row>
            <Feather name="bell" size={24} color="#4a5568" />
            <Text ml="md" fontWeight="bold" fontSize="xl" color="#4a5568">
              Notice board
            </Text>
            <Div
              h={20}
              w={20}
              bg="gray300"
              rounded={"md"}
              ml="sm"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontWeight="bold" color="gray700">
                {notice.length}
              </Text>
            </Div>
          </Div>
          <View style={{ height: 250, marginTop: "2%" }}>
            {notice.length != 0 ? (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={loaddata}
                  />
                }
                data={multiDimensionalUnique(notice)}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={{ marginBottom: "5%", width: width }}
              />
            ) : (
              <Image
                style={{ width: 250, height: 250 }}
                source={require("./assets/empty.png")}
              />
            )}
          </View>
          {/*notice.length != 0 ? (
              <FlatList
                data={multiDimensionalUnique(notice)}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={{ width: width - 20, marginBottom: "5%" }}
              />
            ) : null*/}
        </View>
        {/* <Div mt="xl">
          <Div row>
            <Text fontSize="xl" fontWeight="bold" color="black" ml="lg" mb="md">
              <Ionicons name="today-outline" size={20} color="#4299e1" />
              {"\t"}
              {Days[new Date().getUTCDay() - 1]}
              <Text color="gray500">
                {" "}
                ( Today date {new Date().getUTCDate()} /{" "}
                {new Date().getMonth() + 1} / {new Date().getUTCFullYear()} )
                {"\t"}
                {"\t"}
              </Text>
            </Text>
          </Div>
          {Live.length != 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={true}
              horizontal={true}
              style={{ height: "35%", marginTop: "2%" }}
            >
              {Live.map((n) => (
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
                  >
                    <Text fontWeight="bold" color="white">
                      {"\t"}
                      {n.stime}:{n.smtime} {n.sdn} - {n.etime}:{n.emtime}{" "}
                      {n.edn}
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

                    <OpenURLButton url={n.Link}></OpenURLButton>

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
                              onPress: () => console.log("Cancel Pressed"),
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
                marginLeft: 5,
                marginTop: "20%",
                borderColor: "#cbd5e0",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                color: "black",
              }}
            >
              <View style={{ justifyContent: "center" }}>
                <Image
                  style={{ width: 100, height: 100 }}
                  source={require("./assets/snack-icon.png")}
                />
                <Button
                  mt="lg"
                  px="xl"
                  py="md"
                  bg="#cbd5e0"
                  rounded="circle"
                  color="white"
                  prefix={
                    <FontAwesome name="refresh" size={15} color="white" />
                  }
                  onPress={getlivelectures}
                  shadow={2}
                >
                  ..Refresh
                </Button>
              </View>
            </View>
          )}
        </Div> */}

        <View
          style={{
            justifyContent: "space-evenly",
            flexDirection: "row",
            width: width - 60,
            height: "9%",
            marginTop: "3%",
            position: "absolute",
            top: "80%",
            borderRadius: 20,
          }}
        >
          <Button mt={"5%"} h={45} w={50} rounded="md" p={0}>
            <AntDesign name="home" size={24} color="white" />
          </Button>
          <Button
            bg="white"
            mt={"5%"}
            h={45}
            w={50}
            rounded="md"
            ml="md"
            onPress={() => sheetRef.current.snapTo(1)}
            p={0}
            onPress={() => {
              navigation.navigate("Attendance");
            }}
          >
            <Feather name="edit" size={24} color="#4a5568" />
          </Button>
          <Button
            bg="white"
            mt={"5%"}
            h={45}
            w={50}
            rounded="md"
            ml="md"
            p={0}
            onPress={() => {
              navigation.navigate("Timetable");
            }}
          >
            <MaterialCommunityIcons
              name="timetable"
              size={24}
              color="#4a5568"
            />
          </Button>
          <Button
            bg="white"
            mt={"5%"}
            h={45}
            w={50}
            rounded="md"
            ml="md"
            onPress={() => {
              navigation.navigate("Notice");
            }}
            p={0}
          >
            <Feather name="bell" size={24} color="#4a5568" />
          </Button>
        </View>
      </View>
    </>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Timetable"
          component={TimetableScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>

        <Stack.Screen name="Attendance" component={AttendanceScreen} />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Notice"
          component={NoticeScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>

        <Stack.Screen
          name="Create"
          component={CreateScreen}
          options={{ title: "Create Attendance" }}
        />
        <Stack.Screen
          name="Update"
          component={UpdateScreen}
          options={{ title: "Add Attendance" }}
        />
        <Stack.Screen
          name="View"
          component={ViewScreen}
          options={{ title: "Add Attendance" }}
        />
        <Stack.Screen
          name="Templet"
          component={TempletScreen}
          options={{ title: "Add Attendance" }}
        />
        <Stack.Screen
          name="Student"
          component={StudentScreen}
          options={{
            title: "Add Attendance",
          }}
        />
        <Stack.Screen
          name="Class"
          component={ClassScreen}
          options={{
            title: "Add Attendance",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
