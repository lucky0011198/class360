import * as React from "react";
import { useState, useEffect, useCallback, createContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableHighlight,
  Alert,
  SafeAreaView,
  Clipboard,
  ToastAndroid,
  TextInput,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import Checkbox from "expo-checkbox";

import * as WebBrowser from "expo-web-browser";
import { WebView } from "react-native-webview";
import BottomSheet from "reanimated-bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWindowDimensions } from "react-native";
import { useFonts } from "expo-font";

import {
  Tag,
  Toggle,
  Icon,
  Overlay,
  Modal,
  Button,
  Div,
  ThemeProvider,
  Radio,
  Text,
  Dropdown,
  Fab,
  Header,
  Snackbar,
  SnackbarRef,
} from "react-native-magnus";

import { auth, storage, User } from "../../firebase";

import {
  AntDesign,
  MaterialCommunityIcons,
  Octicons,
  Ionicons,
  MaterialIcons,
  Feather,
  Entypo,
} from "@expo/vector-icons";

export default function ({ navigation }) {
  const [data, setdata] = useState([]);
  const [pined, setpined] = useState([]);
  const [show, setshow] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  let Data = [];
  const loaddata = () => {
    setRefreshing(true);
    User.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((res) => {
        Data.push({ Data: res.data(), id: res.id });
      });
      setdata(Data);
      setRefreshing(false);
    });
  };
  useEffect(() => {
    loaddata();
  }, []);

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

  const renderItem = ({ item }) => {
    return (
      <Div
        w="94%"
        borderRadius={10}
        shadow="lg"
        ml="2.5%"
        mt="lg"
        mb="xl"
        backgroundColor={item.Data.Color}
      >
        <Div justifyContent="space-between" flexWrap="wrap" w="98%" row>
          <Div m="md" row></Div>
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

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loaddata} />
        }
        style={{ backgroundColor: "transparent", marginBottom: "10%" }}
      >
        <Div flexWrap="wrap" display="flex" bg="transparent">
          {data.length != 0 ? (
            <FlatList
              data={multiDimensionalUnique(data)}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={{ width: "100%", marginBottom: "5%" }}
            />
          ) : null}
        </Div>
      </ScrollView>
    </>
  );
}
