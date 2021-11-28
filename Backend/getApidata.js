import * as React from 'react';
import { useState } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native';

export default function getApidata() {
const [data ,setdata] =useState([])

  const getalldata = () => {
  
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      'https://us-central1-eco-signal-327516.cloudfunctions.net/app',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
       setdata(result)
      })
      .catch((error) => console.log('error', error));
  };
  return data; 
}



