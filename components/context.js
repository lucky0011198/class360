import * as  React from 'react';
import  {createContext,useState} from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

const Contextdata = React.createContext('');

import { auth, storage, User, Timetableuser } from '../firebase'


 export default function Timetabledata () {
  const TData=[]
  const[data,setdata]=useState([])
  
  const getTiemtabledata=()=>{
      User.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((res) => {
        TData.push({ Data: res.data(), id: res.id });
      });
      setdata(TData)
    });
  }
 


  return (
    <>
    <Contextdata.Provider value={{data}}>
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Local files and assets can be imported by dragging and dropping them into the editor
      </Text>
      <Image style={styles.logo} source={require('../assets/snack-icon.png')} />
    </View>
    </Contextdata.Provider>
    </>
  );
}

export {Contextdata}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    height: 128,
    width: 128,
  }
});
