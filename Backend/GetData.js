import * as React from 'react';
import { useState } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native';





var requestOptions = {
  method: 'GET',
  redirect: 'follow',
};
const data =()=>{

 return(fetch(
      'https://us-central1-eco-signal-327516.cloudfunctions.net/app',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
       return(result)
      })
      .catch((error) => console.log('error', error))
 )
}

export default data;
 




