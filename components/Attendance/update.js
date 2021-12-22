import Constants from "expo-constants";
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

export default function ({ route, navigation }) {
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
  console.log(route.params.id);
  //let ClassAttendance = [];

  const UpdateData = async () => {
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
    route.params.Data.Attendance = [...route.params.Data.Attendance, ClassData];

    route.params.Data.Student = Data;

    //console.log({ ...route.params.Attendance, ClassData });

    let filename = FileSystem.documentDirectory + route.params.id;
    await FileSystem.writeAsStringAsync(
      filename,
      JSON.stringify(route.params.Data)
    ).then(() => {
      alert("done");
      console.log(route.params.Data);
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
              {(
                (Data.filter((i) => i.state).length / Data.length) *
                100
              ).toFixed(0)}{" "}
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
