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

//import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
//import * as Permissions from "expo-permissions";

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

//importing functions ..

export default function ({ navigation }) {
  const [Type, setType] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [Data, setdata] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [Pin, setPin] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const saveFile = async (data) => {
    let current_datetime = new Date();
    let formatted_date =
      current_datetime.getFullYear() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getDate() +
      " " +
      current_datetime.getHours() +
      ":" +
      current_datetime.getMinutes() +
      ":" +
      current_datetime.getSeconds();
    let filename = FileSystem.documentDirectory + `${formatted_date}.txt`;
    await FileSystem.writeAsStringAsync(filename, JSON.stringify(data)).then(
      () => {
        navigation.navigate("Home", true);
      }
    );
  };
  const loadFile = async () => {
    let filename = FileSystem.documentDirectory + "2021-12-7 6:46:5.txt";
    const file = await FileSystem.readAsStringAsync(filename);
    alert(file);
    console.log(file);
  };
  const read = async () => {
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then((data) => {
      alert(JSON.stringify(data));
    });
  };

  const onSubmit = (data) => {
    if (data.RollFrom < data.RollTo) {
      data["Type"] = Type;
      data["Pin"] = Pin;
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

      saveFile(data);
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
  let dn = new Date(date).getHours() >= 12 ? "PM" : "AM";

  // const pickDocument = async () => {
  //   let result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
  //   setdata(result);
  //   console.log(result);
  // };

  return (
    <SafeAreaView style={{ backgroundColor: "#FF5236", flex: 0 }}>
      <ScrollView style={{ backgroundColor: "#ffff" }}>
        <Overlay visible={overlayVisible} p="xl">
          <ActivityIndicator />
          <Text mt="md">Loading...</Text>
        </Overlay>

        <KeyboardAvoidingView>
          <ScrollView>
            <View style={styles.container}>
              <Div justifyContent="space-between" row>
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
                {/* <Button
                  bg="teal100"
                  h={40}
                  w={40}
                  rounded="circle"
                  ml="md"
                  p={0}
                  onPress={() => {
                    setPin(!Pin);
                  }}
                >
                  {Pin ? (
                    <AntDesign name="pushpin" size={24} color="teal500" />
                  ) : (
                    <AntDesign name="pushpino" size={24} color="#4fd1c5" />
                  )}
                </Button> */}
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
                        <AntDesign name="user" size={15} color="#718096" />
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
                        <Feather name="git-branch" size={19} color="#718096" />
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
                        <AntDesign name="book" size={19} color="#718096" />
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
                <Entypo name="list" size={19} color="black" />
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
                              px="xl"
                              py="md"
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
                <FontAwesome5 name="user" size={19} color="black" />
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

              <Div
                justifyContent="center"
                alignItems="center"
                w={"100%"}
                pb={50}
                row
              >
                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>submit files</Text>
                </TouchableOpacity>
              </Div>
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
    </SafeAreaView>
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
    backgroundColor: "#fff",
    padding: 8,
  },
});
