import Constants from "expo-constants";
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";
import CircularProgress from "react-native-circular-progress-indicator";
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
import * as Permissions from "expo-permissions";
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

import * as DocumentPicker from "expo-document-picker";

import * as firebase from "firebase";
import { Attendance, auth, ClassAttendance } from "../firebase";
import ViewScreen from "./Attendance/View";

function HomeScreen({ route, navigation }) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setdata] = useState([]);
  let Data = [];

  const loaddata = () => {
    setRefreshing(true);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      Attendance.onSnapshot((querySnapshot) => {
        querySnapshot.forEach((res) => {
          if (res.data().uid == user.uid) {
            Data.push({ Data: res.data(), id: res.id });
          }
        });
        setdata(Data);
        setRefreshing(false);
      });
    });
  };

  useEffect(() => {
    loaddata();
  }, []);

  return (
    <>
      {/* attendance header */}

      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loaddata} />
          }
        >
          {/* attendance header */}
          {/* attendance dashboard */}

          {data.map((i) => (
            <Div
              w={"100%"}
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
                  <Text fontWeight="bold" fontSize="xl" mb="xs">
                    {" "}
                    {i.Data.SubjectName}
                  </Text>
                </Div>
                <Button
                  px="lg"
                  py="sm"
                  mr="md"
                  mt="md"
                  bg="#bee3f8"
                  rounded="circle"
                  color="white"
                  shadow={2}
                >
                  <Text fontWeight="bold" color="black">
                    {i.Data.Type}
                  </Text>
                </Button>
              </Div>
              <Div row>
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
                  prefix={<Feather name="git-branch" size={16} color="black" />}
                >
                  <Text fontWeight="bold" color="#718096">
                    {"\t"}
                    {i.Data.department}
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
                  prefix={<AntDesign name="book" size={16} color="black" />}
                >
                  <Text fontWeight="bold" color="#718096">
                    {"\t"}
                    {i.Data.Division}
                    {"\t"}
                  </Text>
                </Button>
              </Div>
              <Div m="lg" row>
                <Button
                  bg="#cbd5e0"
                  h={33}
                  w={33}
                  rounded="circle"
                  p={0}
                  onPress={() => {
                    navigation.navigate("View", i);
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
                    navigation.navigate("Update", i);
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
                    const dbRef = Attendance.doc(i.id);
                    const unsubscribe = auth.onAuthStateChanged((user) => {
                      if (user) {
                        Alert.alert(
                          "Delete record",
                          ` Are you sure you want to delete record ${i.Data.SubjectName}...!`,
                          [
                            {
                              text: "cancel",
                              onPress: () => console.log("Cancel Pressed"),
                              style: "cancel",
                            },
                            {
                              text: "delete",
                              onPress: () => {
                                setRefreshing(true);
                                dbRef.delete().then((res) => {
                                  setRefreshing(false);
                                  alert("Item removed from database");
                                });
                              },
                            },
                          ]
                        );
                      }
                    });
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
                    <MaterialIcons name="date-range" size={16} color="black" />
                  }
                >
                  <Text fontWeight="bold" ml="xs" color="#718096">
                    {i.Data.date}
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
                  <Text fontWeight="bold" ml="xs" color="#718096">
                    {i.Data.time}
                  </Text>
                </Button>
              </Div>
              {/*<Text>{i.Data.uid}</Text>*/}
            </Div>
          ))}
        </ScrollView>

        {/* attendance dashboard */}
        {/* create attendance ,.... */}
        <Button
          bg="#bee3f8"
          position="absolute"
          top={"91%"}
          left={"84%"}
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
        {/* create attendance ,.... */}
      </View>
    </>
  );
}

function CreateScreen({ navigation }) {
  const [Type, setType] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [Data, setdata] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [uid, setuid] = useState("");
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setuid(user.uid);
    });
  }, []);

  const onSubmit = (data) => {
    if (data.RollFrom < data.RollTo) {
      data["Type"] = Type;
      data["date"] = `${new Date(date).getDate()} / ${
        new Date(date).getMonth() + 1
      } /${new Date(date).getFullYear()}`;
      data["time"] = `${new Date(date).getHours()} : ${new Date(
        date
      ).getMinutes()}`;
      let Student = [];
      for (var i = data.RollFrom; i <= data.RollTo; i++) {
        Student.push({
          Roll: i,
          Name: "",
          Present: 0,
          absent: 0,
          attendance: 0,
          state: false,
        });
      }
      data["Student"] = Student;
      data["Attendance"] = [];
      data["uid"] = uid;

      setOverlayVisible(true);

      Attendance.add(data).then(() => {
        setOverlayVisible(false);
        alert("data added ..!");
      });
    } else {
      alert("please select range properly");
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  let h =
    new Date(date).getHours() > 12
      ? new Date(date).getHours() - 12
      : new Date(date).getHours();
  let dn = new Date(date).getHours() > 12 ? "PM" : "AM";

  // console.log(`${new Date(date).getHours()>12?(new Date(date).getHours()-12):new Date(date).getHours()}:${new Date(date).getMinutes()} ${new Date(date).getHours()>12?'PM':'AM'}`)

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    setdata(result);
    console.log(result);
  };

  return (
    <>
      <ScrollView style={{ backgroundColor: "#ecf0f1" }}>
        <Overlay visible={overlayVisible} p="xl">
          <ActivityIndicator />
          <Text mt="md">Loading...</Text>
        </Overlay>
        {/* <Header
        pt="10%"
        alignment="left"
        top="2%"
        prefix={
          <Button bg="#e6fffa" rounded="circle" p={0} h={40} w={40} mr="xl" onPress={()=>{
            navigation.goBack()
          }} >
            <AntDesign name="arrowleft" size={24} color="black" />
          </Button>
        }
        suffix={
          <Div row>
          <Button
            bg="#b2f5ea"
            h={35}
            w={35}
            p={0}

            rounded="circle"
            onPress={showTimepicker}>
            <Ionicons name="time-outline" size={16} color="black" />
          </Button>
          <Button
            bg="#b2f5ea"
            h={35}
            w={35}
            p={0}
            ml="md"
            rounded="circle"
            onPress={showDatepicker}>
            <Fontisto name="date" size={16} color="black" />
          </Button>
          </Div>
        }>
        Create attendance
      </Header>*/}
        <KeyboardAvoidingView>
          <ScrollView>
            <View style={styles.container}>
              <Div mt="md" row>
                <MaterialCommunityIcons
                  name="label-outline"
                  size={24}
                  color="black"
                />
                <Text fontWeight="bold" fontSize="xl" ml="md" color="#718096">
                  Subject Details
                </Text>
              </Div>

              <Div mt="lg">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      p={0}
                      mt="lg"
                      bg="transparent"
                      placeholder="Enter  Subject name"
                      onBlur={onBlur}
                      suffix={
                        <AntDesign name="user" size={24} color="#718096" />
                      }
                      onChangeText={(value) => onChange(value)}
                      value={value}
                    />
                  )}
                  name="SubjectName"
                  rules={{ required: true }}
                />
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      p={0}
                      mt="lg"
                      bg="transparent"
                      suffix={
                        <Feather name="git-branch" size={24} color="#718096" />
                      }
                      placeholder="Enter department"
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                    />
                  )}
                  name="department"
                  rules={{ required: true }}
                />
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      p={0}
                      mt="lg"
                      bg="transparent"
                      suffix={
                        <AntDesign name="book" size={24} color="#718096" />
                      }
                      placeholder="Enter Division"
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                    />
                  )}
                  name="Division"
                  rules={{ required: true }}
                />
              </Div>

              <Div mt="xl" row>
                <Entypo name="list" size={24} color="black" />
                <Text fontWeight="bold" fontSize="xl" ml="md" color="#718096">
                  Lecture Type
                </Text>
              </Div>
              <Div mt="xl">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Radio.Group
                      flexWrap="wrap"
                      onChange={(value) => setType(value)}
                      row
                    >
                      {[
                        "Lecture",
                        "Session",
                        "Tutorial",
                        "seminar",
                        "exam",
                        "workshop",
                        "practical",
                      ].map((item) => (
                        <Radio flexWrap="wrap" value={item}>
                          {({ checked }) => (
                            <Div
                              bg={checked ? "#4fd1c5" : "#e6fffa"}
                              px="lg"
                              py="sm"
                              mr="md"
                              mt="md"
                              rounded="circle"
                            >
                              <Text color={checked ? "white" : "gray800"}>
                                {item}
                              </Text>
                            </Div>
                          )}
                        </Radio>
                      ))}
                    </Radio.Group>
                  )}
                  name="Division"
                  rules={{ required: true }}
                />
              </Div>
              <Div mt="10%" mb="lg" row>
                <FontAwesome5 name="user" size={20} color="black" />
                <Text fontWeight="bold" fontSize="xl" ml="md" color="#718096">
                  Student Details
                </Text>
              </Div>

              <Div justifyContent="space-between" row>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      p={0}
                      mt="lg"
                      w={"48%"}
                      h={"70%"}
                      bg="transparent"
                      placeholder="Roll from"
                      onBlur={onBlur}
                      keyboardType={"number-pad"}
                      suffix={
                        <AntDesign name="user" size={18} color="#718096" />
                      }
                      onChangeText={(value) => onChange(value)}
                      value={value}
                    />
                  )}
                  name="RollFrom"
                  rules={{ required: true }}
                />
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      p={0}
                      mt="lg"
                      w={"48%"}
                      h={"70%"}
                      bg="transparent"
                      placeholder="Roll to"
                      onBlur={onBlur}
                      keyboardType={"number-pad"}
                      suffix={
                        <AntDesign name="user" size={18} color="#718096" />
                      }
                      onChangeText={(value) => onChange(value)}
                      value={value}
                    />
                  )}
                  name="RollTo"
                  rules={{ required: true }}
                />
              </Div>

              <Div mt="5%" mb="lg" row>
                <Fontisto name="date" size={18} color="black" />
                <Text fontWeight="bold" fontSize="xl" ml="md" color="#718096">
                  Date and Time
                </Text>
              </Div>

              <Div justifyContent="space-between" row>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      p={0}
                      mt="lg"
                      w={"48%"}
                      h={"70%"}
                      bg="transparent"
                      placeholder="time"
                      onBlur={onBlur}
                      suffix={
                        <Button
                          bg="#b2f5ea"
                          h={40}
                          w={40}
                          p={0}
                          mt="6%"
                          ml="xs"
                          onPress={showTimepicker}
                        >
                          <Ionicons
                            name="time-outline"
                            size={20}
                            color="black"
                          />
                        </Button>
                      }
                      onChangeText={(value) => onChange(value)}
                      value={`${new Date(date).getHours()} : ${new Date(
                        date
                      ).getMinutes()}`}
                    />
                  )}
                  name="time"
                />
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      p={0}
                      mt="lg"
                      w={"48%"}
                      h={"70%"}
                      bg="transparent"
                      placeholder="date"
                      onBlur={onBlur}
                      suffix={
                        <Button
                          bg="#b2f5ea"
                          h={40}
                          w={40}
                          p={0}
                          mt="6%"
                          ml="xs"
                          onPress={showDatepicker}
                        >
                          <Fontisto name="date" size={16} color="black" />
                        </Button>
                      }
                      onChangeText={(value) => {
                        onChange(value);
                      }}
                      value={`${new Date(date).getDate()} / ${
                        new Date(date).getMonth() + 1
                      } /${new Date(date).getFullYear()}`}
                    />
                  )}
                  name="date"
                />
              </Div>

              <Div justifyContent="center" alignItems="center" w={"100%"} row>
                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>submit files</Text>
                </TouchableOpacity>
              </Div>

              {/* <Div justifyContent="center" alignItems="center" w={'100%'}>
                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  style={styles.button}>
                  <Text style={styles.buttonText}>submit files</Text>
                </TouchableOpacity>
              </Div>

            <View style={{marginTop:'2%'}}>
        <Button
          style={{marginTop:'2%'}}
          color
          title="Reset"
          onPress={() => {
            reset({
              email: 'jane@example.com',
              password: '****'
            })
          }}
        />
      </View>

      <View style={styles.button}>
        <Button
          style={styles.buttonInner}
          color
          title="Button"
          onPress={handleSubmit(onSubmit)}
        />
      </View>*/}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </ScrollView>
    </>
  );
}

function TempletScreen({ navigation }) {
  const [Data, setdata] = useState([]);
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const [isSelected, setSelection] = useState(false);
  const [visible, setVisible] = useState(false);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <ScrollView>
      <Div justifyContent="center" alignItems="center">
        <Div
          w={"95%"}
          h={50}
          mt="lg"
          bg="#b2f5ea"
          justifyContent="space-between"
          rounded="md"
          row
        >
          <Div ml="lg" row>
            <Text fontWeight="bold" fontSize="xl">
              <Ionicons name="file-tray-full-outline" size={24} color="black" />
              {"\t"}
              {"\t"} Default Templet
            </Text>
          </Div>
          <Button
            bg={isSelected ? "#81e6d9" : "white"}
            h={25}
            w={25}
            justifyContent="center"
            m={15}
            p={0}
            borderColor={isSelected ? "#81e6d9" : "#718096"}
            borderWidth={2}
            onPress={() => {
              setSelection(!isSelected);
            }}
          >
            <MaterialIcons name="file-download-done" size={20} color="white" />
          </Button>
        </Div>
      </Div>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text m="lg" fontSize="xl" color="#63b3ed">
          {" "}
          + Create Templet{" "}
        </Text>
      </TouchableOpacity>
      <Modal isVisible={visible}>
        <Div justifyContent="space-between" row>
          <Text
            fontWeight="bold"
            color="#4a5568"
            fontSize="4xl"
            mt="xl"
            ml="xl"
          >
            Create Templets
          </Text>
          <Button
            bg="gray400"
            h={45}
            w={45}
            mt="xl"
            mr="lg"
            rounded="circle"
            onPress={() => {
              setVisible(false);
            }}
          >
            <AntDesign name="close" size={16} color="black" />
          </Button>
        </Div>

        <Div m="lg">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                p={0}
                mt="lg"
                bg="transparent"
                suffix={<AntDesign name="book" size={24} color="#718096" />}
                placeholder="Enter Name of Templet"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
              />
            )}
            name="TempletName"
            rules={{ required: true }}
          />
          <Div justifyContent="space-between" row>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  p={0}
                  mt="lg"
                  w={"48%"}
                  bg="transparent"
                  suffix={<AntDesign name="user" size={24} color="#718096" />}
                  placeholder="Enter Roll from"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                />
              )}
              name="RollFrom"
              rules={{ required: true }}
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  p={0}
                  mt="lg"
                  w={"48%"}
                  bg="transparent"
                  suffix={<AntDesign name="user" size={24} color="#718096" />}
                  placeholder="Enter Roll to"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                />
              )}
              name="RollTo"
              rules={{ required: true }}
            />
          </Div>
        </Div>
      </Modal>
    </ScrollView>
  );
}

function UpdateScreen({ route, navigation }) {
  const [Data, setdata] = useState(route.params.Data.Student);
  const [on, toggle] = useState(false);
  const [State, setStete] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, settime] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  useEffect(() => {
    if (on) {
      setStete(true);
      const newlist = Data.map((newitem) => {
        if (true) {
          return {
            ...newitem,
            state: true,
          };
        }

        return {
          ...newitem,
          state: true,
        };
      });

      setdata(newlist);
    } else {
      setStete(false);
      const newlist = Data.map((newitem) => {
        if (true) {
          return {
            ...newitem,
            state: false,
          };
        }

        return {
          ...newitem,
          state: false,
        };
      });

      setdata(newlist);
    }
  }, [on]);
  const dropdownRef = React.createRef();

  let data = route.params.Data.Student;
  //console.log(Data);
  //let ClassAttendance = [];

  const UpdateData = () => {
    let ClassData = {
      Total: Data.length,
      date: `${new Date(date).getDate()} / ${
        new Date(date).getMonth() + 1
      } /${new Date(date).getFullYear()}`,
      Time: `${new Date(date).getHours()} : ${new Date(date).getMinutes()}`,
      Present: Data.filter((i) => i.state).length,
      Absent: Data.filter((i) => !i.state).length,
      PresentData: Data.filter((i) => i.state),
      AbsentData: Data.filter((i) => !i.state),
      ClassAttendance: (Data.filter((i) => i.state).length / Data.length) * 100,
      uid: route.params.id,
    };
    Data.filter((i) => i.state).map((i) => {
      i.Present = i.Present + 1;
    });
    Data.filter((i) => !i.state).map((i) => {
      i.absent = i.absent + 1;
    });

    Data.map((i) => {
      i.attendance = (i.Present / (i.Present + i.absent)) * 100;
    });

    route.params.Data.Student = Data;

    //console.log({ ...route.params.Attendance, ClassData });

    Attendance.doc(route.params.id)
      .set(route.params.Data)
      .then(() => {
        ClassAttendance.add(ClassData).then(() => {
          alert("data Added successfully");
        });
      });
  };

  return (
    <View style={styles.container}>
      <Text color="gray500" ml="3%">
        {" "}
        {""}staticstic data
      </Text>
      <Div
        shadow="lg"
        mt={"2%"}
        style={{
          backgroundColor: "white",
          justifyContent: "space-around",
          margin: "3%",
          height: 140,
          borderRadius: 10,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Div
            h={60}
            w={60}
            rounded="2xl"
            color="#b2f5ea"
            justifyContent="center"
            alignItems="center"
          >
            <Text style={{ fontSize: 25, fontWeight: "bold", color: "black" }}>
              {(Data.filter((i) => i.state).length / Data.length) * 100}{" "}
              <Text fontSize={20} fontWeight="bold" color="#718096">
                %
              </Text>
            </Text>
          </Div>

          <Div bg="white" h={20} w={80} rounded="md" mt="md">
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              Total Students
            </Text>
          </Div>
        </View>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Div
            shadow="md"
            bg="#68d391"
            h={60}
            w={60}
            rounded="2xl"
            color="white"
            justifyContent="center"
            alignItems="center"
          >
            <Text style={{ fontSize: 25, fontWeight: "bold", color: "#ffff" }}>
              {Data.filter((i) => i.state).length}
            </Text>
          </Div>
          <Div shadow="2xl" bg="white" h={20} w={80} rounded="md" mt="lg">
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              prsent
            </Text>
          </Div>
        </View>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Div
            shadow="md"
            bg="#f56565"
            h={60}
            w={60}
            rounded="2xl"
            color="white"
            justifyContent="center"
            alignItems="center"
          >
            <Text style={{ fontSize: 25, fontWeight: "bold", color: "#ffff" }}>
              {Data.filter((i) => !i.state).length}
            </Text>
          </Div>
          <Div shadow="2xl" bg="white" h={20} w={80} rounded="md" my="lg">
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              Absent
            </Text>
          </Div>
        </View>
      </Div>
      <ScrollView>
        <Div justifyContent="center" flexWrap="wrap" row>
          {typeof route.params.Data.Student != "undefined"
            ? Data.map((n) => (
                <TouchableOpacity
                  style={{
                    width: 55,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "1%",
                    borderRadius: 10,
                    borderColor: n.state ? "#4fd1c5" : "#a0aec0",
                    borderWidth: 1,
                    backgroundColor: n.state ? "#4fd1c5" : "transparent",
                  }}
                  onPress={() => {
                    const newlist = Data.map((newitem) => {
                      if (newitem.Roll == n.Roll) {
                        return {
                          ...newitem,
                          state: !newitem.state,
                        };
                      }

                      return {
                        ...newitem,
                        state: newitem.state,
                      };
                    });

                    setdata(newlist);
                  }}
                >
                  <Text fontWeight="bold" color={n.state ? "white" : "black"}>
                    {n.state ? (
                      <AntDesign name="user" size={18} color="white" />
                    ) : (
                      <AntDesign
                        name="deleteuser"
                        size={18}
                        color={n.state ? "white" : "#a0aec0"}
                      />
                    )}

                    {n.Roll}
                  </Text>
                </TouchableOpacity>
              ))
            : null}
        </Div>
      </ScrollView>

      <Div justifyContent="space-between" row>
        <Input
          p={0}
          mt="lg"
          w={"48%"}
          h={"70%"}
          bg="transparent"
          placeholder="time"
          suffix={
            <Button
              bg="#b2f5ea"
              h={40}
              w={40}
              p={0}
              mt="6%"
              ml="xs"
              onPress={showTimepicker}
            >
              <Ionicons name="time-outline" size={20} color="black" />
            </Button>
          }
          onChangeText={settime}
          value={`${new Date(date).getHours()} : ${new Date(
            date
          ).getMinutes()}`}
        />

        <Input
          p={0}
          mt="lg"
          w={"48%"}
          h={"70%"}
          bg="transparent"
          placeholder="date"
          suffix={
            <Button
              bg="#b2f5ea"
              h={40}
              w={40}
              p={0}
              mt="6%"
              ml="xs"
              onPress={showDatepicker}
            >
              <Fontisto name="date" size={16} color="black" />
            </Button>
          }
          onChangeText={setDate}
          value={`${new Date(date).getDate()} / ${
            new Date(date).getMonth() + 1
          } /${new Date(date).getFullYear()}`}
        />
      </Div>

      <Div justifyContent="space-between" row>
        <Div row>
          <Button
            ml="md"
            mb="xl"
            px="xl"
            py="sm"
            shadow="xl"
            bg="#ffff"
            rounded="circle"
            color="white"
            prefix={<AntDesign name="clouduploado" size={24} color="#38b2ac" />}
            onPress={UpdateData}
          >
            <Text fontWeight="bold" color="#38b2ac">
              {" "}
              {""}update data
            </Text>
          </Button>
          <Button
            ml="md"
            mb="xl"
            px="xl"
            py="md"
            shadow="xl"
            bg="teal200"
            rounded="circle"
            prefix={<Feather name="users" size={20} color="#38b2ac" />}
            //onPress={UpdateData}
            onPress={() => {
              navigation.navigate("View", route.params);
            }}
          >
            <Text fontWeight="bold" color="#38b2ac">
              {" "}
              {""}View data
            </Text>
          </Button>
        </Div>
        <Div mr="lg">
          <Toggle
            on={on}
            onPress={() => toggle(!on)}
            bg={on ? "green200" : "red200"}
            circleBg="red400"
            activeBg="green400"
            h={27}
            mt="xs"
            w={50}
          />
          <Text fontWeight="bold" fontSize="xs" ml="md" color="#718096">
            {on ? "Present" : "Absent"}
          </Text>
        </Div>
      </Div>

      {/* <Fab
        bg="white"
        p={0}
        h={50}
        w={50}
        icon={
          State ? (
            <AntDesign name="user" size={18} color="green" />
          ) : (
            <AntDesign name="deleteuser" size={18} color="red" />
          )
        }
      >
        <Button
          p="none"
          bg="transparent"
          justifyContent="flex-end"
          onPress={() => {
            setStete(true);
            const newlist = Data.map((newitem) => {
              if (true) {
                return {
                  ...newitem,
                  state: true,
                };
              }

              return {
                ...newitem,
                state: true,
              };
            });

            setdata(newlist);
          }}
        >
          <Div rounded="sm" bg="white" p="sm">
            <Text fontSize="md" fontSize="xs" fontWeight="bold">
              default preset
            </Text>
          </Div>
          <Icon
            name="user"
            color="green600"
            h={50}
            w={50}
            fontSize="3xl"
            fontWeight="bold"
            rounded="circle"
            ml="md"
            bg="white"
          />
        </Button>
        <Button
          p="none"
          bg="transparent"
          justifyContent="flex-end"
          onPress={() => {
            setStete(false);
            const newlist = Data.map((newitem) => {
              if (true) {
                return {
                  ...newitem,
                  state: false,
                };
              }

              return {
                ...newitem,
                state: false,
              };
            });

            setdata(newlist);
          }}
        >
          <Div rounded="sm" bg="white" p="sm">
            <Text fontSize="md" fontSize="xs" fontWeight="bold">
              default absent
            </Text>
          </Div>
          <Icon
            name="deleteuser"
            color="red600"
            h={50}
            w={50}
            fontWeight="bold"
            fontSize="3xl"
            rounded="circle"
            ml="md"
            bg="white"
          />
        </Button>
      </Fab>*/}
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      <Dropdown
        ref={dropdownRef}
        title={
          <Text mx="xl" color="gray500" pb="md">
            This is your title
          </Text>
        }
        mt="md"
        pb="2xl"
        showSwipeIndicator={true}
        roundedTop="xl"
      >
        <Dropdown.Option py="md" px="xl" block>
          First Option
        </Dropdown.Option>
        <Dropdown.Option py="md" px="xl" block>
          Second Option
        </Dropdown.Option>
        <Dropdown.Option py="md" px="xl" block>
          Third Option
        </Dropdown.Option>
      </Dropdown>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function ({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Attendances",
        }}
      />
      <Stack.Screen
        name="Update"
        component={UpdateScreen}
        options={{
          title: " Add Attendances",
        }}
      />
      <Stack.Screen
        name="View"
        component={ViewScreen}
        options={{
          title: "Attendance Data",
        }}
      />
      <Stack.Screen
        name="Create"
        component={CreateScreen}
        options={{
          title: "Create attendance",
        }}
      />
      <Stack.Screen
        name="Templet"
        component={TempletScreen}
        options={{
          title: " Create Templet",
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4fd1c5",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "5%",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
});
