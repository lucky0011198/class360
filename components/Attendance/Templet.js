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
import Constants from "expo-constants";

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
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

export default function ({ navigation }) {
  const [Name, setName] = useState("");
  const [data, setdata] = useState([]);
  const [record, setrecord] = useState([]);

  const read = async () => {
    await FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
      (data) => {
        //setrecord(data);
        setrecord(data.filter((i) => i.split(".")[1] != "txt"));
      }
    );
  };

  const Delete = (id) => {
    FileSystem.deleteAsync(FileSystem.documentDirectory + id).then(() => {
      read();
    });
  };

  useEffect(() => {
    read();
  }, []);
  return (
    <>
      <Div w={"100%"} alignItems="center" mt="md">
        <Radio.Group>
          {record.length != 0
            ? record.map((n) => (
                <Radio
                  value={n}
                  prefix={
                    <Div
                      w={"90%"}
                      h={50}
                      bg="teal100"
                      justifyContent="space-between"
                      row
                    >
                      <Div justifyContent="center" row>
                        <Button
                          bg="red200"
                          h={30}
                          w={30}
                          mr="xs"
                          mt="md"
                          rounded="xl"
                          p={0}
                          onPress={async () => {
                            //Delete(n);

                            await FileSystem.readAsStringAsync(
                              FileSystem.documentDirectory + n,
                              { decoding: FileSystem.EncodingType.Base64 }
                            ).then((data) => {
                              alert(JSON.parse(data));
                            });
                          }}
                        >
                          <MaterialCommunityIcons
                            name="delete-sweep-outline"
                            size={20}
                            color="#f56565"
                          />
                        </Button>
                        <Div
                          h={40}
                          w={40}
                          mt="sm"
                          rounded={"xl"}
                          bg="teal400"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Feather name="file-text" size={24} color="white" />
                        </Div>

                        <Text ml={"lg"} fontSize={"md"} fontWeight="bold">
                          {n}
                        </Text>
                      </Div>
                    </Div>
                  }
                />
              ))
            : null}
        </Radio.Group>
        <Div width={"90%"} mt="xl" mb="lg" justifyContent="flex-start">
          <Text fontSize={"lg"}>upload new file</Text>
        </Div>

        <Div justifyContent="flex-start" position="relative" row>
          <Div
            w="90%"
            h={40}
            w={40}
            mt="sm"
            rounded={"xl"}
            bg="gray400"
            justifyContent="center"
            alignItems="center"
          >
            <MaterialIcons
              name="upload-file"
              size={24}
              color="white"
              onPress={async () => {
                if (Name) {
                  let result = await DocumentPicker.getDocumentAsync({});

                  await FileSystem.readAsStringAsync(result.uri).then(
                    async (i) => {
                      let fileUri =
                        FileSystem.documentDirectory + `${Name}.csv`;
                      await FileSystem.writeAsStringAsync(
                        fileUri,
                        JSON.stringify(i)
                      ).then(() => {
                        alert("Templet saved..!");
                        read();
                      });
                    }
                  );
                } else {
                  alert("enter name");
                }
              }}
            />
          </Div>

          <TextInput
            style={{ width: "60%", marginLeft: "5%" }}
            onChangeText={setName}
            value={Name}
            placeholder="Enter the name of file"
          />
          <Div
            w="90%"
            h={40}
            w={40}
            mt="sm"
            ml="xl"
            rounded={"xl"}
            bg="gray400"
            justifyContent="center"
            alignItems="center"
          >
            <MaterialCommunityIcons
              name="file-refresh-outline"
              size={24}
              color="white"
            />
          </Div>
        </Div>
      </Div>

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
        onPress={async () => {
          let result = await DocumentPicker.getDocumentAsync({});
          let fileUri = FileSystem.documentDirectory + `${Name}.csv`;
          await FileSystem.writeAsStringAsync(
            fileUri,
            JSON.stringify(result)
          ).then(() => {
            alert("Templet saved..!");
          });
        }}
      >
        <Entypo name="plus" size={24} color="#2b6cb0" />
      </Button>
    </>
  );
}
