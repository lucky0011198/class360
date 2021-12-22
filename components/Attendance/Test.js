import React, { useContext, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";
//import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from "expo-file-system";
//import * as Permissions from 'expo-permissions';

// You can import from local files
//import AssetExample from './components/AssetExample';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Button, Icon, Div } from "react-native-magnus";

const storeData = async () => {
  try {
    const jsonValue = JSON.stringify(USER_1);
    await AsyncStorage.setItem("@storage_Key", jsonValue);
    alert("data added");
  } catch (e) {
    alert(e);
  }
};

const getAllKeys = async () => {
  let keys = [];
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    console.log(e);
  }

  console.log(keys);
};

const updatedata = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@storage_Key");
    if (jsonValue != null) {
      let data = jsonValue;

      let Attendance = await AsyncStorage.mergeItem(
        "@storage_Key",
        JSON.stringify({
          Attendance: [],
        })
      );
      await getData();
    }
  } catch (e) {
    alert(e);
  }
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@storage_Key");
    console.log(jsonValue);
    return jsonValue != null ? JSON.stringify(jsonValue) : null;
  } catch (e) {
    alert(e);
  }
};

const saveFile = async () => {
  let filename = FileSystem.documentDirectory + "text.txt";
  await FileSystem.writeAsStringAsync(filename, "Hello man").then(() => {
    alert("done");
  });
};

const loadFile = async () => {
  let filename = FileSystem.documentDirectory + "text.txt";
  const file = await FileSystem.readAsStringAsync(filename);
  alert(file);
  console.log(file);
};

const Downloadfile = async () => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === "granted") {
    let fileUri = FileSystem.documentDirectory + "text.txt";
    // await FileSystem.writeAsStringAsync(fileUri, 'Hello World', {
    //   encoding: FileSystem.EncodingType.UTF8,
    // });
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync("class360", asset, false).then(
      (data) => {
        console.log(data);
      }
    );
  }
};

export default { saveFile, loadFile };
