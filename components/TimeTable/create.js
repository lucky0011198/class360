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
import { useForm, Controller } from "react-hook-form";
import { useWindowDimensions, CheckBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import BottomSheet from "reanimated-bottom-sheet";
import Animated, { concat } from "react-native-reanimated";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Timetableuser } from "../../firebase";

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
  Snackbar,
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

//importing functions ..

export default function HomeScreen({ route, navigation }) {
  const [isShow, setisShow] = useState("flex");
  const [Subject, onChangeSubject] = useState("");
  const [Name, onChangeName] = useState("");
  const [Link, onChangelink] = useState("");
  const [Branch, setBranch] = useState("");
  const [Discriptions, onChangeDiscriptions] = useState("");
  const [current, setcurrent] = useState("");
  const [Local, setLocal] = useState([]);
  const [doremon, setdoremon] = useState([]);
  const sheetRef = React.useRef(null);
  let d = new Date();
  let Edate = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
  //timinng .....
  const [stime, onChangestime] = useState("00");
  const [smtime, onChangesmtime] = useState("00");
  const [etime, onChangeetime] = useState("00");
  const [emtime, onChangeemtime] = useState("00");
  const [sdn, onChangesdn] = useState("");
  const [edn, onChangeedn] = useState("");
  const [type, onchangetype] = useState("");
  const [Monday, setMonday] = useState([]);
  const [AData, setAData] = useState([]);
  const [Tuseday, setTuseday] = useState([]);
  const [Wednesday, setWednesday] = useState([]);
  const [Thursday, setThursday] = useState([]);
  const [Friday, setFriday] = useState([]);
  const [Saturday, setSaturday] = useState([]);
  let Days = [
    "Monday",
    "Tuseday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getalldata = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://us-central1-eco-signal-327516.cloudfunctions.net/app",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setLocal(result[0].Data);
        setdoremon(result);
        //console.log(result.filter((i)=>(i.Data.Branch==Branch)));
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getalldata();
    if (route.params) {
      if (route.params.data[0]) {
        setMonday(route.params.data[0].Data[0].items);
        setTuseday(route.params.data[0].Data[1].items);
        setWednesday(route.params.data[0].Data[2].items);
        setThursday(route.params.data[0].Data[3].items);
        setFriday(route.params.data[0].Data[4].items);
        setSaturday(route.params.data[0].Data[5].items);
        console.log(route.params.data[0].Branch);
      } else {
        setMonday(route.params.data.Data[0].items);
        setTuseday(route.params.data.Data[1].items);
        setWednesday(route.params.data.Data[2].items);
        setThursday(route.params.data.Data[3].items);
        setFriday(route.params.data.Data[4].items);
        setSaturday(route.params.data.Data[5].items);
        console.log(route.params.data.Branch);
      }
    }
    //setBranch(route.params.data.Branch);
  }, []);
  //console.log(Monday)

  const [on, toggle] = useState(false);
  const dropdownRef = React.createRef();

  let data = [
    { day: "Monday", items: Monday },
    { day: "Tuseday", items: Tuseday },
    { day: "Wednesday", items: Wednesday },
    { day: "Thursday", items: Thursday },
    { day: "Friday", items: Friday },
    { day: "Saturday", items: Saturday },
  ];

  //console.log(data)

  const addData = () => {
    if (Branch) {
      // console.log({ Branch, Data: data });
      Timetableuser.add({ Branch, Data: data }).then(() => {
        alert("data inserted");
      });
    } else {
      alert("please enter branch detials");
    }
  };

  const deletdata = (id) => {};

  const updateddata = (id, branch) => {
    console.log(data, id, branch);
  };
  let Data = {
    Subject,
    Name,
    Link,
    Discriptions,
    Edate,
    stime,
    smtime,
    etime,
    emtime,
    sdn,
    edn,
    type,
  };

  data.map((i) => {
    i["selected"] = false;
  });

  const { height, width } = useWindowDimensions();

  const storeData = async (value) => {
    console.log(value);
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(`${value}`, jsonValue);
      console.log("done");
    } catch (e) {
      console.log("sorry");
    }
  };

  const getData = async (n) => {
    try {
      const value = await AsyncStorage.getItem(n);
      if (value !== null) {
        // console.log(value);
        alert(value);
        return value;
      }
    } catch (e) {
      console.log("empty");
    }
  };

  const snackbarRef = React.createRef();

  return (
    <View style={styles.container}>
      <Snackbar ref={snackbarRef} bg="green" color="white" />
      <View style={styles.header}>
        {typeof route.params != "undefined" ? (
          <Button
            mt="lg"
            ml="md"
            px="xl"
            py="lg"
            bg="blue500"
            rounded="circle"
            color="white"
            shadow={2}
            onPress={() => {
              Alert.alert(
                "Submit Data",
                `Adding data in branch ${route.params} in online(database)`,
                [
                  {
                    text: "Cancel",
                    style: "red",
                  },
                  {
                    text: "submit",
                    onPress: () => {
                      updateddata(route.params);
                    },
                    style: "cancel",
                  },
                ]
              );
            }}
            suffix={
              <Feather name="arrow-right-circle" size={15} color="white" />
            }
          >
            <Text color="white"> Update {"\t"}</Text>
          </Button>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        ></View>
      </View>

      <ScrollView style={{ width: "100%" }}>
        {!on
          ? data.map((i) => (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginTop: "5%",
                }}
              >
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
                    <Button
                      px="xl"
                      py="md"
                      bg="#cbd5e0"
                      rounded="circle"
                      color="white"
                      onPress={() => {
                        dropdownRef.current.open();
                        setcurrent(i.day);
                      }}
                      shadow={2}
                    >
                      <Entypo name="plus" size={16} color="white" />
                    </Button>
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
                            borderColor: n.selected ? "#ff9d9d" : "#c2f5d0",
                            borderWidth: 2,
                            //borderColor: '#e2e8f0',
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
                              {n.Subject}
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
                                {n.type}
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
                              {n.stime}:{n.smtime} {n.sdn} - {n.etime}:
                              {n.emtime} {n.edn}
                            </Text>
                          </Div>

                          <Text m="lg" color="gray700">
                            {n.Discriptions}
                          </Text>
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
                                sheetRef.current.snapTo(1);
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
                              bg="#cbd5e0"
                              rounded="circle"
                              color="white"
                              onPress={() => {
                                Alert.alert("session link", n.Link, [
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
                              }}
                              shadow={2}
                            >
                              <Feather name="link-2" size={19} color="black" />
                            </Button>
                            <Button
                              px="md"
                              py="sm"
                              mr="lg"
                              mt="lg"
                              bg="#cbd5e0"
                              rounded="circle"
                              color="white"
                              onPress={() => {
                                //setcurrent(i.day)
                                //eval(`set${current}`)(eval(current).filter((i,index)=>(index!= eval(current).indexOf(n))))
                                //console.log(current)

                                Alert.alert(
                                  "Delete Record",
                                  "Are you sure ! you want to delete this record",
                                  [
                                    {
                                      text: "Cancel",
                                      onPress: () =>
                                        console.log("Cancel Pressed"),
                                      style: "cancel",
                                    },
                                    {
                                      text: "Delete",
                                      onPress: () => {
                                        eval(`set${i.day}`)(
                                          eval(i.day).filter(
                                            (j, index) =>
                                              index != eval(i.day).indexOf(n)
                                          )
                                        );
                                      },
                                    },
                                  ]
                                );
                              }}
                              shadow={2}
                            >
                              <AntDesign
                                name="delete"
                                size={20}
                                color="black"
                              />
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
                        //borderColor: n[0].selected ? '#ff9d9d' : '#c2f5d0',
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
                            setcurrent(i.day);
                            //dropdownRef.current.open();
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
            ))
          : Local.map((i) => (
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
                      <Text color="gray">
                        {" "}
                        ( Today date {new Date().getUTCDate()} /{" "}
                        {new Date().getMonth() + 1} /{" "}
                        {new Date().getUTCFullYear()} ){"\t"}
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
                            borderColor: n.selected ? "#ff9d9d" : "#c2f5d0",
                            borderWidth: 2,
                            //borderColor: '#e2e8f0',
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
                              {n.Subject}
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
                                {n.type}
                              </Text>
                            </Button>
                          </View>

                          <Button
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
                            prefix={
                              <Ionicons
                                name="time-outline"
                                size={19}
                                color="black"
                              />
                            }
                            shadow={2}
                          >
                            <Text fontWeight="bold" color="white">
                              {n.stime}:{n.smtime} {n.sdn} - {n.etime}:
                              {n.emtime} {n.edn}
                            </Text>
                          </Button>

                          <Text m="lg" color="gray700">
                            {n.Discriptions}
                          </Text>
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
                                sheetRef.current.snapTo(2);
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
                              bg="#cbd5e0"
                              rounded="circle"
                              color="white"
                              onPress={() => {
                                Alert.alert("session link", n.Link, [
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
                        //borderColor: n[0].selected ? '#ff9d9d' : '#c2f5d0',
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
                            setcurrent(i.day);
                            //dropdownRef.current.open();
                            sheetRef.current.snapTo(2);
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

      {typeof route.params === "undefined" ? (
        <Div
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          m={"2%"}
          bg="transparent"
          row
        >
          <Input
            placeholder="branch"
            w={"45%"}
            mt="lg"
            ml="xs"
            value={Branch}
            onChangeText={setBranch}
            px="xl"
            py="lg"
            rounded="circle"
            focusBorderColor="blue700"
            suffix={<Feather name="git-branch" size={24} color="#cbd5e0" />}
          />
          <Button
            mt="lg"
            ml="md"
            px="xl"
            py="lg"
            bg="blue500"
            rounded="circle"
            color="white"
            shadow={2}
            onPress={() => {
              Alert.alert(
                "Submit Data",
                `Adding data in branch ${Branch} in online(database)`,
                [
                  {
                    text: "Cancel",
                    style: "red",
                  },

                  {
                    text: "submit",
                    onPress: () => {
                      addData();
                    },
                    style: "cancel",
                  },
                ]
              );
            }}
            suffix={
              <Feather name="arrow-right-circle" size={15} color="white" />
            }
          >
            <Text color="white"> submit {"\t"}</Text>
          </Button>
        </Div>
      ) : (
        <Div
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          m={"2%"}
          bg="transparent"
          row
        >
          <Button
            mt="lg"
            ml="md"
            px="xl"
            py="lg"
            bg="blue500"
            rounded="circle"
            color="white"
            shadow={2}
            onPress={() => {
              //console.log(route.params)
              let id = "";
              let data = [];
              let branch = "";
              try {
                id = route.params.data[0].id;
                data = route.params.data[0].Data;
                branch = route.params.data[0].Branch;
              } catch {
                id = route.params.data.id;
                data = route.params.data.Data;
                branch = route.params.data.Branch;
              }
              Alert.alert(
                "Submit updated Data  ..!",
                `Update data in branch id:${id} data:${branch} `,
                [
                  {
                    text: "Cancel",
                    style: "red",
                  },
                  {
                    /*
                    text: 'offline',
                    onPress:  () => {
                     setAData(getData(Branch))
                     console.log(AData)
                    }
                  */
                  },
                  {
                    text: "submit",
                    onPress: () => {
                      updateddata(id, branch);
                    },
                    style: "cancel",
                  },
                ]
              );
            }}
            suffix={
              <Feather name="arrow-right-circle" size={15} color="white" />
            }
          >
            <Text color="white"> submit {"\t"}</Text>
          </Button>
          <Button
            mt="lg"
            ml="md"
            h={40}
            w={40}
            bg="blue500"
            rounded="circle"
            color="white"
            onPress={() => navigation.navigate("Details")}
            shadow={2}
          >
            +
          </Button>
        </Div>
      )}

      <Dropdown
        ref={dropdownRef}
        title={
          <Text mx="xl" color="gray500" pb="md">
            Edite detials
          </Text>
        }
        mt="md"
        pb="2xl"
        justifyContent="center"
        h={"90%"}
        showSwipeIndicator={false}
        roundedTop="xl"
        w={width}
        alignItems="center"
      >
        <ScrollView>
          <View
            style={{
              width: width - 40,
              height: 200,
              marginLeft: 5,
              //borderColor: n[0].selected ? '#ff9d9d' : '#c2f5d0',
              borderWidth: 2,
              borderColor: "#e2e8f0",
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
                {Subject}
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
                  {type}
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
                {stime}:{smtime} {sdn} - {etime}:{emtime} {edn}
              </Text>
            </Div>

            <Text m="lg" color="gray700">
              {Discriptions}
            </Text>
            <Div ml={"3%"} row>
              {/* <Button
                    px="md"
                    py="sm"
                    mr="md"
                    mt="lg"
                    bg="#cbd5e0"
                    rounded="circle"
                    color="white"
                    shadow={2}>
                    <Text fontWeight="bold" color="white">
                      Copy link
                    </Text>
                  </Button>*/}
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
            </Div>
          </View>
          <ScrollView>
            <View style={{ marginBottom: "20%", justifyContent: "center" }}>
              <Input
                placeholder="Enter your name"
                value={Name}
                onChangeText={onChangeName}
                w={"97%"}
                mt="xl"
                h={50}
                focusBorderColor="blue700"
                suffix={<Feather name="user" size={24} color="#a0aec0" />}
                onFocus={() => {}}
              />
              <Input
                placeholder="Enter subject name"
                value={Subject}
                onChangeText={onChangeSubject}
                w={"97%"}
                mt="lg"
                focusBorderColor="blue700"
                suffix={<Feather name="user" size={24} color="#a0aec0" />}
              />

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <Input
                  placeholder="00"
                  keyboardType={"numeric"}
                  maxLength={2}
                  value={stime}
                  onChangeText={onChangestime}
                  w={"15%"}
                  mt="lg"
                  focusBorderColor="blue700"
                />
                <Input
                  placeholder="00"
                  keyboardType={"numeric"}
                  maxLength={2}
                  value={smtime}
                  onChangeText={onChangesmtime}
                  w={"15%"}
                  mt="lg"
                  ml="xs"
                  focusBorderColor="blue700"
                />
                <Input
                  placeholder="AM/PM"
                  value={sdn.toUpperCase()}
                  maxLength={2}
                  onChangeText={onChangesdn}
                  w={"15%"}
                  ml="xs"
                  mt="lg"
                  focusBorderColor="blue700"
                />

                <Text>
                  {" "}
                  {"\t"}:{"\t"}
                </Text>
                <Input
                  placeholder="00"
                  keyboardType={"numeric"}
                  maxLength={2}
                  value={etime}
                  onChangeText={onChangeetime}
                  w={"12%"}
                  mt="lg"
                  ml="xs"
                  focusBorderColor="blue700"
                />
                <Input
                  placeholder="00"
                  keyboardType={"numeric"}
                  maxLength={2}
                  value={emtime}
                  onChangeText={onChangeemtime}
                  w={"15%"}
                  mt="lg"
                  ml="xs"
                  focusBorderColor="blue700"
                />
                <Input
                  placeholder="AM/PM"
                  maxLength={2}
                  value={edn.toUpperCase()}
                  onChangeText={onChangeedn}
                  w={"15%"}
                  ml="xs"
                  mt="lg"
                  focusBorderColor="blue700"
                />
              </View>
              <Input
                placeholder="Discriptions"
                value={Discriptions}
                onChangeText={onChangeDiscriptions}
                w={"97%"}
                mt="lg"
                focusBorderColor="blue700"
                suffix={<Feather name="user" size={24} color="#a0aec0" />}
              />
              <Input
                placeholder="http//:example.com   "
                value={Link}
                onChangeText={onChangelink}
                w={"97%"}
                mt="lg"
                focusBorderColor="blue700"
                suffix={<Feather name="user" size={24} color="#a0aec0" />}
              />

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <Input
                  placeholder="type"
                  value={type}
                  onChangeText={onchangetype}
                  w={"48%"}
                  mt="lg"
                  focusBorderColor="blue700"
                  suffix={<Feather name="user" size={24} color="#a0aec0" />}
                />
                <Button
                  w={"48%"}
                  mt="lg"
                  ml="xs"
                  onPress={() => {
                    let temp = ["PM", "AM"];
                    //console.log(temp.includes(sdn.toUpperCase()))
                    //console.log(smtime<=60 && emtime<=60)

                    if (
                      temp.includes(sdn.toUpperCase()) &&
                      temp.includes(edn.toUpperCase()) &&
                      stime <= 12 &&
                      etime <= 12 &&
                      smtime <= 60 &&
                      emtime <= 60
                    ) {
                      alert("validated");
                    } else {
                      alert("not valideted");
                    }

                    eval(`set${current}`)(eval(current).concat(Data));
                    dropdownRef.current.close();
                    // console.log(current, Data);
                  }}
                  suffix={
                    <Feather
                      name="arrow-right-circle"
                      mt="xs"
                      size={24}
                      color="white"
                    />
                  }
                >
                  <Text fontSize="3xl" fontWeight="bold" color="white">
                    submit{"\t"}
                  </Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </Dropdown>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
