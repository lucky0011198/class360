import React, { useContext, useState, createContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";

export const contextdata = React.createContext({});

export default function Data({ children }) {
  const [data, detdata] = useState({ name: "sdbhjshv" });
  return (
    <contextdata.Provider value={data} ref={data}>
      {children}
    </contextdata.Provider>
  );
}
