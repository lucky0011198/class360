import * as React from 'react';
import { useState, useEffect, useCallback, createContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TouchableHighlight,
  Alert,
  Image,
  Linking,
  SafeAreaView,
  Clipboard,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWindowDimensions } from 'react-native';
import { useFonts } from 'expo-font';
import {
  Toggle,
  Icon,
  Button,
  Div,
  ThemeProvider,
  Radio,
  Text,
  Dropdown,
  Input,
  Fab,
  Snackbar,
  SnackbarRef,
} from 'react-native-magnus';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//icon
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();



function removeDuplicateObjectFromArray(array, key) {
  let check = {};
  let res = [];
  for (let i = 0; i < array.length; i++) {
    if (!check[array[i][key]]) {
      check[array[i][key]] = true;
      res.push(array[i]);
    }
  }
  return res;
}


const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'invalide link',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  }, [url]);

  return (
    <Button
      title={children}
      onPress={handlePress}
      px="md"
      py="sm"
      mr="lg"
      mt="lg"
      bg="blue500"
      rounded="circle"
      color="white"
      suffix={
        <Feather name="arrow-right-circle" mt="xs" size={19} color="white" />
      }
      shadow={'lg'}>
      <Text fontWeight="bold" color="white">
        Attend session{'\t'}
      </Text>
    </Button>
  );
};

let DAta = [];
const getcontextdata = (data) => {
  DAta = data;
};
console.log(DAta);
const LiveTimebale = React.createContext();



//

function DetailsScreen({ navigation }) {
  const [Local, setLocal] = useState([]);
  const [Data ,setdata]= useState([]);
  const [doremon, setdoremon] = useState([]);
  const [Branchs, setBranchs] = useState([]);
  const { height, width } = useWindowDimensions();
  const [branch, setBranch] = useState('');
  const [Live, setLive] = useState([]);
  const [MLive, setMLive] = useState([]);
  const [state, setstate] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  // let lhour = 8;
  // let lmin = 0;
  // let lam_pm = 'PM';

  // let ehour = 8;
  // let emin = 14;
  // let eam_pm = 'PM';

  let flag = 'offline';
  let LLst = '';
  let Days = [
    'Monday',
    'Tuseday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let status = 'offline';

  let Branch = [];
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

  const getalldata = () => {
    setRefreshing(true);
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
        //console.log(result);
        setdoremon(result);
        if (branch) {
          if (doremon.length != 0) {
            setLocal(doremon.filter((u) => u.Branch == branch)[0].Data);
          }
        }
        setRefreshing(false);
        result.map((i) => {
          Branch.push(i.Branch);
        });

        setBranchs(multiDimensionalUnique(Branch));
      })
      .catch((error) => console.log('error', error));
  };

  const compareTime = (startTime, endTime) => {
    const currentTime = new Date(
      2021,
      9,
      30,
      new Date().getHours(),
      new Date().getMinutes(),
      new Date().getSeconds(),
      new Date().getMilliseconds()
    );

    if (
      currentTime.getTime() >= startTime.getTime() &&
      currentTime.getTime() <= endTime.getTime()
    ) {
      setTimeout(() => {
        getalldata();
        setivedata();
        setRefreshing(true);

        doremon.map((i) => {
          i.Data.map((j) => {
            if (j.day == Days[new Date().getDay() - 1]) {
              j.items.map((item) => {
                item['state'] = 'offline';
              });
            }
          });
        });
      }, endTime.getTime() - currentTime.getTime());
      return (status = 'online');
    }

    return (status = 'offline');
  };

   function getDate(year, month, day, hours, minutes, str) {
    if (str.toLowerCase() == 'pm' && hours>12) {
      hours = hours + 12; 
    }
    
    return new Date(year, month, day, hours, minutes, 0, 0);
  }
  let currentTime = new Date(
    2021,
    9,
    31,
    new Date().getHours(),
    new Date().getMinutes(),
    new Date().getSeconds(),
    new Date().getMilliseconds()
  );

  {
    doremon.length != 0
      ? doremon.map((i) => {
          i.Data.map((j) => {
            if (j.day == Days[new Date().getDay() - 1]) {
              j.items.map((item) => {
                item['state'] = compareTime(
                  getDate(
                    2021,
                    9,
                    30,
                    Number(item.stime),
                    Number(item.smtime),
                    item.sdn
                  ),
                  getDate(
                    2021,
                    9,
                    30,
                    Number(item.etime),
                    Number(item.emtime),
                    item.sdn
                  )
                );
              });
            }
          });
        })
      : null;
  }

  {
    doremon.length != 0 ? getcontextdata(doremon) : null;
  }

  const setivedata = () => {
    getalldata();

    if (doremon.length != 0) {
      doremon.map((k) => {
        if (k.Branch == branch) {
          k.Data.map((h) => {
            if (h.day == Days[new Date().getDay() - 1]) {
              h.items.map((l) => {
                if (l.state == 'online') {
                  setLive(l);
                  console.log(l);
                } else {
                  setLive([]);
                }
              });
            }
          });
        }
      });
    }
  };

  //getalldata()

  const deletdata = (id) => {
    //console.log(id)
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let raw = JSON.stringify({
      id: id,
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    fetch(
      'https://us-central1-eco-signal-327516.cloudfunctions.net/app/delete',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        alert(result);
        getalldata();
        setivedata();
      })
      .catch((error) => console.log('error', error));
  };

  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = (sessionlink) => {
    if (sessionlink) {
      Clipboard.setString(sessionlink);
      ToastAndroid.showWithGravityAndOffset(
        'Link copied',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };

  useEffect(() => {
    getalldata();
    setivedata();
  }, []);

  return (
     <>
      <SafeAreaView style={{ backgroundColor: '#4299e1', height: '4%' }} />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              getalldata();
              setivedata();
            }}
          />
        }>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            backgroundColor: '#4299e1',
            marginBottom: '3%',
            borderBottomRightRadius: 10,
            borderBottomStartRadius: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '2%',
              margin: '3%',
            }}>
            <Button
              bg="#e2e8f0"
              h={40}
              w={43}
              rounded="circle"
              onPress={() => {
                navigation.goBack();
              }}>
              <Feather name="arrow-left-circle" size={20} color="#2d3748" />
            </Button>

            <Text
              style={{
                fontSize: 25,
                color: 'white',
              }}>
              {'\t'}
              {'\t'}Timetable
            </Text>

            <Button
              px="lg"
              py="xs"
              ml="xl"
              mt="md"
              bg="white"
              rounded="circle"
              color="white"
              shadow={10}
              prefix={
                <Ionicons
                  name="ios-refresh-circle-outline"
                  size={19}
                  color="black"
                />
              }
              onPress={() => {
                getalldata();
                setivedata();
              }}>
              <Text fontWeight="bold" color="#4a5568">
                {'\t'}Refresh
              </Text>
            </Button>
          </View>

          {Live.length != 0 ? (
            <View
              style={{
                width: width - 20,
                height: 200,
                marginLeft: '2%',
                //borderColor: n.selected ? '#ff9d9d' : '#c2f5d0',
                //borderWidth: 2,
                //borderColor: '#cbd5e0',
                borderRadius: 10,
                color: 'black',
                marginTop: '2%',
                backgroundColor: '#67aeeb',
                backdropfilter: 'blur(0) saturate(200%)',
                //-webKitbackdropfilter: 'blur(0) saturate(200%)',
                backgrCoundcolor: 'rgba(255, 255, 255, 0.36)',
                // border: '1px solid #cbd5e0',
              }}>
              <View
                style={{
                  height: '25%',
                  width: '100%',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  zIndex: 10,
                }}>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color="white"
                  mt="lg"
                  ml="xl">
                  {Live.Subject}
                </Text>
                <Button
                  px="md"
                  py="sm"
                  mr="md"
                  mt="lg"
                  bg="#63b3ed"
                  rounded="circle"
                  color="white"
                  shadow={2}>
                  <Text fontWeight="bold" color="white">
                    {Live.type}
                  </Text>
                </Button>
              </View>

              <Div
                w={160}
                px="sm"
                py="sm"
                mr="sm"
                mt="xs"
                ml="lg"
                alignItems="center"
                bg="#4299e1"
                rounded="circle"
                color="white"
                shadow={2}>
                <Text fontWeight="bold" color="white">
                  {Live.stime}:{Live.smtime} {Live.sdn} - {Live.etime}:
                  {Live.emtime} {Live.edn}
                </Text>
              </Div>
              <Div row>
                <Button
                  px="lg"
                  py="xs"
                  ml="lg"
                  mt="lg"
                  bg="white"
                  rounded="circle"
                  color="white"
                  shadow={10}
                  onPress={() => {
                    getalldata();
                  }}>
                  <Text fontWeight="bold" color="#4a5568">
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor:
                          state == 'online' ? '#68d391' : '#e2e8f0',
                        borderRadius: 10,
                      }}
                    />{' '}
                    {Live.state}
                  </Text>
                </Button>
              </Div>
              <Div ml={'3%'} row>
                <Button
                  px="md"
                  py="sm"
                  mr="md"
                  mt="lg"
                  bg="#cbd5e0"
                  rounded="circle"
                  color="white"
                  shadow={2}
                  onPress={() => {
                    //getalldata();
                  }}>
                  <Text fontWeight="bold" color="white">
                    Copy link
                  </Text>
                </Button>

                <Button
                  px="md"
                  py="sm"
                  mr="lg"
                  mt="lg"
                  bg="blue500"
                  rounded="circle"
                  color="white"
                  suffix={
                    <Feather
                      name="arrow-right-circle"
                      mt="xs"
                      size={19}
                      color="white"
                    />
                  }
                  shadow={'lg'}>
                  <Text fontWeight="bold" color="white">
                    Attend session{'\t'}
                  </Text>
                </Button>

                <Button
                  px="md"
                  py="sm"
                  mr="lg"
                  mt="lg"
                  bg="white"
                  rounded="circle"
                  color="white"
                  onPress={() => {
                    Alert.alert('session link', Live.Link, [
                      {
                        text: 'open',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'ok',
                        onPress: () => {},
                      },
                    ]);
                  }}
                  shadow={'lg'}>
                  <Feather name="link-2" size={19} color="black" />
                </Button>
              </Div>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              marginTop: '3%',
              justifyContent: 'flex-start',
              marginLeft: '4%',
              marginBottom: '3%',
            }}>
            {doremon.length != 0 ? (
              <>
                <Button
                  px="xl"
                  py="md"
                  mr="md"
                  bg="white"
                  rounded="circle"
                  color="white"
                  prefix={<AntDesign name="book" size={15} color="black" />}
                  shadow={10}
                  onPress={() => {
                    getalldata();
                  }}>
                  <Text fontWeight="bold" color="#4a5568">
                    {'\t'}
                    {branch ? branch : null}
                  </Text>
                </Button>
                <Button
                  px="md"
                  py="sm"
                  mr="lg"
                  bg="white"
                  rounded="circle"
                  color="white"
                  onPress={() => {
                    let id = '';
                    if (branch) {
                      id = doremon.filter((j) => j.Branch == branch)[0].id;
                    } else {
                      id = doremon[0].id;
                    }

                    //console.log(doremon.filter((i)=>(i.Branch==branch))[0].id)
                    Alert.alert(
                      'Delete Record',
                      `Are you sure ! you want to delete this record `,
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Delete',
                          onPress: () => {
                            deletdata(id);
                          },
                        },
                      ]
                    );
                  }}
                  shadow={'lg'}>
                  <AntDesign name="delete" size={19} color="black" />
                </Button>
                <Button
                  px="md"
                  py="sm"
                  mr="lg"
                  bg="white"
                  rounded="circle"
                  color="white"
                  onPress={() => {
                    if (branch) {
                      if (doremon) {
                        navigation.navigate('Home', {
                          data: doremon
                            ? doremon.filter((l) => l.Branch == branch)
                            : null,
                          mode: true,
                          branch,
                        });
                      } else {
                        ToastAndroid.showWithGravity(
                          'empty data ',
                          ToastAndroid.SHORT,
                          ToastAndroid.CENTER
                        );
                      }
                    } else {
                      if (doremon) {
                        setBranch(doremon[0].Branch);
                        navigation.navigate('Home', {
                          data: doremon ? doremon[0] : null,
                          mode: true,
                          branch,
                        });
                      } else {
                        ToastAndroid.showWithGravity(
                          'empty data ',
                          ToastAndroid.SHORT,
                          ToastAndroid.CENTER
                        );
                      }
                    }
                  }}
                  shadow={'lg'}>
                  <MaterialCommunityIcons
                    name="circle-edit-outline"
                    size={19}
                    color="black"
                  />
                </Button>
              </>
            ) : null}
            <Button
              px="md"
              py="sm"
              mr="lg"
              bg="white"
              rounded="circle"
              color="black"
              prefix={
                <Ionicons
                  name="ios-add-circle-outline"
                  size={20}
                  color="black"
                />
              }
              onPress={() => {
                navigation.navigate('Home');
              }}
              shadow={'lg'}></Button>
          </View>
        </View>

        {Branchs.length != 0 ? (
          <ScrollView>
            {Local.map((i) => (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <View style={{ height: 250 }}>
                  <Div row>
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color="black"
                      ml="lg"
                      mb="md">
                      <Ionicons
                        name="today-outline"
                        size={20}
                        color="#4299e1"
                      />
                      {'\t'}
                      {i.day}{' '}
                      <Text color="gray500">
                        {' '}
                        ( Updated at 13-6-2021 ){'\t'}
                        {'\t'}
                      </Text>
                    </Text>
                  </Div>
                  {i.items != 0 ? (
                    <ScrollView
                      showsVerticalScrollIndicator={true}
                      horizontal={true}
                      style={{ height: '35%', marginTop: '3%' }}>
                      {i.items.map((n) => (
                        <View
                          style={{
                            width: width - 40,
                            height: 200,
                            marginLeft: 5,
                            //borderColor: n.selected ? '#ff9d9d' : '#c2f5d0',
                            borderWidth: 2,
                            borderColor: '#cbd5e0',
                            borderRadius: 10,
                            color: 'black',
                          }}>
                          <View
                            style={{
                              height: '25%',
                              width: '100%',
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              fontSize="xl"
                              fontWeight="bold"
                              color="black"
                              mt="lg"
                              ml="xl">
                              <MaterialCommunityIcons
                                name="text-subject"
                                size={20}
                                color="black"
                              />
                              {n.Subject}
                            </Text>
                            <Button
                              px="md"
                              py="sm"
                              mr="md"
                              mt="lg"
                              bg={n.state == 'online' ? '#68d391' : '#a0aec0'}
                              rounded="circle"
                              color="white"
                              shadow={2}>
                              <Text fontWeight="bold" color="white">
                                {n.state}
                              </Text>
                            </Button>
                          </View>

                          <Button
                            w={170}
                            px="sm"
                            py="sm"
                            mr="sm"
                            mt="xs"
                            ml="lg"
                            alignItems="center"
                            bg="#4299e1"
                            rounded="circle"
                            color="white"
                            shadow={2}
                            prefix={
                              <Ionicons
                                name="time-outline"
                                size={16}
                                color="white"
                              />
                            }>
                            <Text fontWeight="bold" color="white">
                              {'\t'}
                              {n.stime}:{n.smtime} {n.sdn} - {n.etime}:
                              {n.emtime} {n.edn}
                            </Text>
                          </Button>

                          {n.type && n.Discriptions ? (
                            <Text color="#a0aec0" mt="md" ml="lg" p="xs">
                              {n.type} conducting by{' '}
                              <Text fontWeight="bold" color="#4a5568">
                                {n.Name}{' '}
                              </Text>
                              {'\t'}
                              {'\n'}
                              <Text fontWeight="bold" color="#4a5568">
                                {' '}
                                Discription:
                                <Text color="#a0aec0"> {n.Discriptions}</Text>
                              </Text>
                            </Text>
                          ) : null}

                          <Div ml={'3%'} row>
                            <Button
                              px="md"
                              py="sm"
                              mr="md"
                              mt="lg"
                              bg="#cbd5e0"
                              rounded="circle"
                              color="white"
                              shadow={2}
                              onPress={() => copyToClipboard(n.Link)}>
                              <Text fontWeight="bold" color="white">
                                Copy link
                              </Text>
                            </Button>
                            <OpenURLButton url={n.Link}> jdsbfh</OpenURLButton>
                            <Button
                              px="md"
                              py="sm"
                              mr="lg"
                              mt="lg"
                              bg="#cbd5e0"
                              rounded="circle"
                              color="white"
                              onPress={() => {
                                if (n.Link) {
                                  Alert.alert('session link', `${n.Link}`, [
                                    {
                                      text: 'open',
                                      onPress: () =>
                                        console.log('Cancel Pressed'),
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'ok',
                                      onPress: () => {},
                                    },
                                  ]);
                                } else {
                                  alert('url not found');
                                }
                              }}
                              shadow={2}>
                              <Feather name="link-2" size={19} color="black" />
                            </Button>
                          </Div>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <View
                      style={{
                        width: width - 20,
                        height: '90%',
                        marginLeft: 5,
                        borderColor: '#cbd5e0',
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'black',
                      }}>
                      <View>
                        <Image
                          style={{ width: 88, height: 88 }}
                          source={{
                            uri: 'https://img.icons8.com/cotton/2x/4a90e2/add-database.png',
                          }}
                        />
                        <Button
                          mt="lg"
                          px="xl"
                          py="md"
                          bg="#cbd5e0"
                          rounded="circle"
                          color="white"
                          onPress={() => {
                            navigation.navigate('Home');
                          }}
                          shadow={2}>
                          Add data
                        </Button>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        ) :null
       }
      </ScrollView>

      <Fab
        bg="#edf2f7"
        color="black"
        icon={
          <MaterialCommunityIcons
            name="filter-minus-outline"
            size={23}
            color="black"
          />
        }
        h={50}
        w={50}
        p={0}>
        {Branchs.map((k) => (
          <Button
            p="none"
            bg="transparent"
            justifyContent="flex-end"
            onPress={() => {
              setBranch(k);
              if (doremon) {
                setLocal(doremon.filter((j) => j.Branch == k)[0].Data);
              }
            }}>
            <Div rounded="xl" bg="white" px={'lg'} py={'md'}>
              <Text fontSize="md" fontWeight="bold">
                {k} <AntDesign name="export" size={16} color="black" />
              </Text>
            </Div>
          </Button>
        ))}
      </Fab>
    </>
  );
}

function HomeScreen({ route, navigation }) {
  const [isShow, setisShow] = useState('flex');
  const [Subject, onChangeSubject] = useState('');
  const [Name, onChangeName] = useState('');
  const [Link, onChangelink] = useState('');
  const [Branch, setBranch] = useState('');
  const [Discriptions, onChangeDiscriptions] = useState('');
  const [current, setcurrent] = useState('');
  const [Local, setLocal] = useState([]);
  const [doremon, setdoremon] = useState([]);
  const sheetRef = React.useRef(null);
  let d = new Date();
  let Edate = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
  //timinng .....
  const [stime, onChangestime] = useState('00');
  const [smtime, onChangesmtime] = useState('00');
  const [etime, onChangeetime] = useState('00');
  const [emtime, onChangeemtime] = useState('00');
  const [sdn, onChangesdn] = useState('');
  const [edn, onChangeedn] = useState('');
  const [type, onchangetype] = useState('');
  const [Monday, setMonday] = useState([]);
  const [AData, setAData] = useState([]);
  const [Tuseday, setTuseday] = useState([]);
  const [Wednesday, setWednesday] = useState([]);
  const [Thursday, setThursday] = useState([]);
  const [Friday, setFriday] = useState([]);
  const [Saturday, setSaturday] = useState([]);
  let Days = [
    'Monday',
    'Tuseday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  //screens for navihations

  //console.log(route.params);
  let database = [];
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
        setLocal(result[0].Data);
        setdoremon(result);
        //console.log(result.filter((i)=>(i.Data.Branch==Branch)));
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    getalldata();
    //console.log(route.params.data[0].Branch)
    if (route.params) {
      if (route.params.data[0]) {
        setMonday(route.params.data[0].Data[0].items);
        setTuseday(route.params.data[0].Data[1].items);
        setWednesday(route.params.data[0].Data[2].items);
        setThursday(route.params.data[0].Data[3].items);
        setFriday(route.params.data[0].Data[4].items);
        setSaturday(route.params.data[0].Data[5].items);
        console.log(route.params.data[0].Branch);
      } else {
        setMonday(route.params.data.Data[0].items);
        setTuseday(route.params.data.Data[1].items);
        setWednesday(route.params.data.Data[2].items);
        setThursday(route.params.data.Data[3].items);
        setFriday(route.params.data.Data[4].items);
        setSaturday(route.params.data.Data[5].items);
        console.log(route.params.data.Branch);
      }
    }
    //setBranch(route.params.data.Branch);
  }, []);
  //console.log(Monday)

  const [on, toggle] = useState(false);
  const dropdownRef = React.createRef();

  let data = [
    { day: 'Monday', items: Monday },
    { day: 'Tuseday', items: Tuseday },
    { day: 'Wednesday', items: Wednesday },
    { day: 'Thursday', items: Thursday },
    { day: 'Friday', items: Friday },
    { day: 'Saturday', items: Saturday },
  ];

  //console.log(data)

  const addData = () => {
    if (Branch) {
      // var requestOptions = {
      //   method: 'POST',
      //   body: JSON.stringify([{Branch, data }]),
      //   redirect: 'follow',
      // };

      // fetch(
      //   'https://us-central1-eco-signal-327516.cloudfunctions.net/app/create',
      //   requestOptions
      // )
      //   .then((response) => response.json())
      //   .then((result) => console.log(result))
      //   .catch((error) => console.log('error', error));
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({ Branch, Data: data });
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(
        'https://us-central1-eco-signal-327516.cloudfunctions.net/app/create',
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          alert(result);
        })
        .catch((error) => console.log('error', error));
    } else {
      alert('please enter branch detials');
    }
  };

  const deletdata = (id) => {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let raw = JSON.stringify({
      id: id,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      'https://us-central1-eco-signal-327516.cloudfunctions.net/app/delete',
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        alert('deta deleted');
      })
      .catch((error) => console.log('error', error));
  };

  const updateddata = (id, branch) => {
    console.log(data, id, branch);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      id: id,
      Branch: branch,
      Data: data,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      'https://us-central1-eco-signal-327516.cloudfunctions.net/app/update',
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log('error', error));

    getalldata();
  };
  let Data = {
    Subject,
    Name,
    Link,
    Discriptions,
    Edate,
    stime,
    smtime,
    etime,
    emtime,
    sdn,
    edn,
    type,
  };

  //Monday....

  // const [demodata, setdemodata] = useState([
  //   { day: 'Monday' },
  //   { day: 'Tuseday' },
  //   { day: 'Wednesday' },
  // ]);

  // let data = [
  //   { day: 'Monday', items: Monday },
  //   { day: 'Tuseday', items: Tuseday },
  //   { day: 'Wednesday', items: Wednesday },
  //   { day: 'Thursday', items: Thursday },
  //   { day: 'Friday', items: Friday },
  //   { day: 'Saturday', items: Saturday },
  // ];

  data.map((i) => {
    i['selected'] = false;
  });

  const { height, width } = useWindowDimensions();

  const storeData = async (value) => {
    console.log(value);
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(`${value}`, jsonValue);
      console.log('done');
    } catch (e) {
      console.log('sorry');
    }
  };

  const getData = async (n) => {
    try {
      const value = await AsyncStorage.getItem(n);
      if (value !== null) {
        // console.log(value);
        alert(value);
        return value;
      }
    } catch (e) {
      console.log('empty');
    }
  };

  const snackbarRef = React.createRef();

  return (
    <>
      <SafeAreaView style={{ backgroundColor: 'red' }} />
      <View style={styles.container}>
        <Snackbar ref={snackbarRef} bg="green" color="white" />
        <View style={styles.header}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: '2%',
              margin: '3%',
            }}>
            <Button
              bg="#e2e8f0"
              h={40}
              w={43}
              rounded="circle"
              onPress={() => {
                navigation.goBack();
              }}>
              <Feather name="arrow-left-circle" size={20} color="#2d3748" />
            </Button>

            <Text style={{ fontSize: 25 }}>
              {'\t'}
              {'\t'}Timetable
            </Text>
          </View>

          {typeof route.params != 'undefined' ? (
            <Button
              mt="lg"
              ml="md"
              px="xl"
              py="lg"
              bg="blue500"
              rounded="circle"
              color="white"
              shadow={2}
              onPress={() => {
                Alert.alert(
                  'Submit Data',
                  `Adding data in branch ${route.params} in online(database)`,
                  [
                    {
                      text: 'Cancel',
                      style: 'red',
                    },
                    {
                      text: 'submit',
                      onPress: () => {
                        updateddata(route.params);
                      },
                      style: 'cancel',
                    },
                  ]
                );
              }}
              suffix={
                <Feather name="arrow-right-circle" size={15} color="white" />
              }>
              <Text color="white"> Update {'\t'}</Text>
            </Button>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}></View>
        </View>

        {/*<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Div m="xl">
          <Radio.Group row>
            {['ELN', 'IT', 'CSE'].map((item) => (
              <Radio
                value={item}
                justifyContent="space-around"
                alignItems="center"
                flexDirection="row"
                flexWrap="wrap"
                color="white"
                m={'md'}>
                {({ checked }) => (
                  <Div
                    bg={checked ? '#4299e1' : 'blue100'}
                    px="xl"
                    py="md"
                    mr="md"
                    rounded="circle">
                    <Text color={checked ? 'white' : 'gray800'}>{item}</Text>
                  </Div>
                )}
              </Radio>
            ))}
          </Radio.Group>
        </Div>
      </View>*/}
        <ScrollView>
          {!on
            ? data.map((i) => (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: '5%',
                  }}>
                  <View style={{ height: 250 }}>
                    <Div row>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="black"
                        ml="lg"
                        mb="md">
                        <Ionicons
                          name="today-outline"
                          size={20}
                          color="#4299e1"
                        />
                        {'\t'}
                        {i.day}{' '}
                        <Text color="gray500">
                          {' '}
                          ( Updated at 13-6-2021 ){'\t'}
                          {'\t'}
                        </Text>
                      </Text>
                      <Button
                        px="xl"
                        py="md"
                        bg="#cbd5e0"
                        rounded="circle"
                        color="white"
                        onPress={() => {
                          dropdownRef.current.open();
                          setcurrent(i.day);
                        }}
                        shadow={2}>
                        <Entypo name="plus" size={16} color="white" />
                      </Button>
                    </Div>
                    {i.items != 0 ? (
                      <ScrollView
                        showsVerticalScrollIndicator={true}
                        horizontal={true}
                        style={{ height: '35%', marginTop: '3%' }}>
                        {i.items.map((n) => (
                          <View
                            style={{
                              width: width - 40,
                              height: 200,
                              marginLeft: 5,
                              borderColor: n.selected ? '#ff9d9d' : '#c2f5d0',
                              borderWidth: 2,
                              //borderColor: '#e2e8f0',
                              borderRadius: 10,
                              color: 'black',
                            }}>
                            <View
                              style={{
                                height: '25%',
                                width: '100%',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                              }}>
                              <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color="black"
                                mt="lg"
                                ml="xl">
                                {n.Subject}
                              </Text>
                              <Button
                                px="md"
                                py="sm"
                                mr="md"
                                mt="lg"
                                bg="#63b3ed"
                                rounded="circle"
                                color="white"
                                shadow={2}>
                                <Text fontWeight="bold" color="white">
                                  {n.type}
                                </Text>
                              </Button>
                            </View>

                            <Div
                              w={160}
                              px="sm"
                              py="sm"
                              mr="sm"
                              mt="xs"
                              ml="lg"
                              alignItems="center"
                              bg="#4299e1"
                              rounded="circle"
                              color="white"
                              shadow={2}>
                              <Text fontWeight="bold" color="white">
                                {n.stime}:{n.smtime} {n.sdn} - {n.etime}:
                                {n.emtime} {n.edn}
                              </Text>
                            </Div>

                            <Text m="lg" color="gray700">
                              {n.Discriptions}
                            </Text>
                            <Div ml={'3%'} row>
                              <Button
                                px="md"
                                py="sm"
                                mr="md"
                                mt="lg"
                                bg="#cbd5e0"
                                rounded="circle"
                                color="white"
                                shadow={2}
                                onPress={() => {
                                  sheetRef.current.snapTo(1);
                                }}>
                                <Text fontWeight="bold" color="white">
                                  Copy link
                                </Text>
                              </Button>
                              <Button
                                px="md"
                                py="sm"
                                mr="lg"
                                mt="lg"
                                bg="blue500"
                                rounded="circle"
                                color="white"
                                suffix={
                                  <Feather
                                    name="arrow-right-circle"
                                    mt="xs"
                                    size={19}
                                    color="white"
                                  />
                                }
                                shadow={'lg'}>
                                <Text fontWeight="bold" color="white">
                                  Attend session{'\t'}
                                </Text>
                              </Button>
                              <Button
                                px="md"
                                py="sm"
                                mr="lg"
                                mt="lg"
                                bg="#cbd5e0"
                                rounded="circle"
                                color="white"
                                onPress={() => {
                                  Alert.alert('session link', n.Link, [
                                    {
                                      text: 'open',
                                      onPress: () =>
                                        console.log('Cancel Pressed'),
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'ok',
                                      onPress: () => {},
                                    },
                                  ]);
                                }}
                                shadow={2}>
                                <Feather
                                  name="link-2"
                                  size={19}
                                  color="black"
                                />
                              </Button>
                              <Button
                                px="md"
                                py="sm"
                                mr="lg"
                                mt="lg"
                                bg="#cbd5e0"
                                rounded="circle"
                                color="white"
                                onPress={() => {
                                  //setcurrent(i.day)
                                  //eval(`set${current}`)(eval(current).filter((i,index)=>(index!= eval(current).indexOf(n))))
                                  //console.log(current)

                                  Alert.alert(
                                    'Delete Record',
                                    'Are you sure ! you want to delete this record',
                                    [
                                      {
                                        text: 'Cancel',
                                        onPress: () =>
                                          console.log('Cancel Pressed'),
                                        style: 'cancel',
                                      },
                                      {
                                        text: 'Delete',
                                        onPress: () => {
                                          eval(`set${i.day}`)(
                                            eval(i.day).filter(
                                              (j, index) =>
                                                index != eval(i.day).indexOf(n)
                                            )
                                          );
                                        },
                                      },
                                    ]
                                  );
                                }}
                                shadow={2}>
                                <AntDesign
                                  name="delete"
                                  size={20}
                                  color="black"
                                />
                              </Button>
                            </Div>
                          </View>
                        ))}
                      </ScrollView>
                    ) : (
                      <View
                        style={{
                          width: width - 20,
                          height: '90%',
                          marginLeft: 5,
                          //borderColor: n[0].selected ? '#ff9d9d' : '#c2f5d0',
                          borderRadius: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'black',
                        }}>
                        <View>
                          <Image
                            style={{ width: 88, height: 88 }}
                            source={{
                              uri: 'https://img.icons8.com/cotton/2x/4a90e2/add-database.png',
                            }}
                          />
                          <Button
                            mt="lg"
                            px="xl"
                            py="md"
                            bg="#cbd5e0"
                            rounded="circle"
                            color="white"
                            onPress={() => {
                              setcurrent(i.day);
                              //dropdownRef.current.open();
                            }}
                            shadow={2}>
                            Add data
                          </Button>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              ))
            : Local.map((i) => (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <View style={{ height: 250 }}>
                    <Div row>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="black"
                        ml="lg"
                        mb="md">
                        <Ionicons
                          name="today-outline"
                          size={20}
                          color="#4299e1"
                        />
                        {'\t'}
                        {i.day}{' '}
                        <Text color="gray">
                          {' '}
                          ( Today date {(new Date().getUTCDate())} / {(new Date().getMonth()+1)} / {new Date().getUTCFullYear()} ){'\t'}
                          {'\t'}
                        </Text>
                      </Text>
                    </Div>
                    {i.items != 0 ? (
                      <ScrollView
                        showsVerticalScrollIndicator={true}
                        horizontal={true}
                        style={{ height: '35%', marginTop: '3%' }}>
                        {i.items.map((n) => (
                          <View
                            style={{
                              width: width - 40,
                              height: 200,
                              marginLeft: 5,
                              borderColor: n.selected ? '#ff9d9d' : '#c2f5d0',
                              borderWidth: 2,
                              //borderColor: '#e2e8f0',
                              borderRadius: 10,
                              color: 'black',
                            }}>
                            <View
                              style={{
                                height: '25%',
                                width: '100%',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                              }}>
                              <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color="black"
                                mt="lg"
                                ml="xl">
                                {n.Subject}
                              </Text>
                              <Button
                                px="md"
                                py="sm"
                                mr="md"
                                mt="lg"
                                bg="#63b3ed"
                                rounded="circle"
                                color="white"
                                shadow={2}>
                                <Text fontWeight="bold" color="white">
                                  {n.type}
                                </Text>
                              </Button>
                            </View>

                            <Button
                              w={160}
                              px="sm"
                              py="sm"
                              mr="sm"
                              mt="xs"
                              ml="lg"
                              alignItems="center"
                              bg="#4299e1"
                              rounded="circle"
                              color="white"
                              prefix={
                                <Ionicons
                                  name="time-outline"
                                  size={19}
                                  color="black"
                                />
                              }
                              shadow={2}>
                              <Text fontWeight="bold" color="white">
                                {n.stime}:{n.smtime} {n.sdn} - {n.etime}:
                                {n.emtime} {n.edn}
                              </Text>
                            </Button>

                            <Text m="lg" color="gray700">
                              {n.Discriptions}
                            </Text>
                            <Div ml={'3%'} row>
                              <Button
                                px="md"
                                py="sm"
                                mr="md"
                                mt="lg"
                                bg="#cbd5e0"
                                rounded="circle"
                                color="white"
                                shadow={2}
                                onPress={() => {
                                  sheetRef.current.snapTo(2);
                                }}>
                                <Text fontWeight="bold" color="white">
                                  Copy link
                                </Text>
                              </Button>
                              <Button
                                px="md"
                                py="sm"
                                mr="lg"
                                mt="lg"
                                bg="blue500"
                                rounded="circle"
                                color="white"
                                suffix={
                                  <Feather
                                    name="arrow-right-circle"
                                    mt="xs"
                                    size={19}
                                    color="white"
                                  />
                                }
                                shadow={'lg'}>
                                <Text fontWeight="bold" color="white">
                                  Attend session{'\t'}
                                </Text>
                              </Button>
                              <Button
                                px="md"
                                py="sm"
                                mr="lg"
                                mt="lg"
                                bg="#cbd5e0"
                                rounded="circle"
                                color="white"
                                onPress={() => {
                                  Alert.alert('session link', n.Link, [
                                    {
                                      text: 'open',
                                      onPress: () =>
                                        console.log('Cancel Pressed'),
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'ok',
                                      onPress: () => {},
                                    },
                                  ]);
                                }}
                                shadow={2}>
                                <Feather
                                  name="link-2"
                                  size={19}
                                  color="black"
                                />
                              </Button>
                            </Div>
                          </View>
                        ))}
                      </ScrollView>
                    ) : (
                      <View
                        style={{
                          width: width - 20,
                          height: '90%',
                          marginLeft: 5,
                          //borderColor: n[0].selected ? '#ff9d9d' : '#c2f5d0',
                          borderRadius: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'black',
                        }}>
                        <View>
                          <Image
                            style={{ width: 88, height: 88 }}
                            source={{
                              uri: 'https://img.icons8.com/cotton/2x/4a90e2/add-database.png',
                            }}
                          />
                          <Button
                            mt="lg"
                            px="xl"
                            py="md"
                            bg="#cbd5e0"
                            rounded="circle"
                            color="white"
                            onPress={() => {
                              setcurrent(i.day);
                              //dropdownRef.current.open();
                              sheetRef.current.snapTo(2);
                            }}
                            shadow={2}>
                            Add data
                          </Button>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              ))}
        </ScrollView>

        {/*<Fab  icon={<AntDesign name="upcircleo" size={20} color="white" />} bg="blue600" h={50} w={50} p={10}>
  <Button p="none" bg="transparent" justifyContent="flex-end">
    <Div rounded="sm" bg="white" p="sm">
      <Text fontSize="md">Cheer</Text>
    </Div>
    <Icon
      name="user"
      color="blue600"
      h={50}
      w={50}
      rounded="circle"
      ml="md"
      bg="white"
    />
  </Button>
  <Button p="none" bg="transparent" justifyContent="flex-end">
    <Div rounded="sm" bg="white" p="sm">
      <Text fontSize="md">Boost</Text>
    </Div>
    <Icon
      name="user"
      color="blue600"
      h={50}
      w={50}
      rounded="circle"
      ml="md"
      bg="white"
    />
  </Button>
</Fab>
*/}
        {typeof route.params === 'undefined' ? (
          <Div
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            m={'2%'}
            row>
            <Input
              placeholder="branch"
              w={'45%'}
              mt="lg"
              ml="xs"
              value={Branch}
              onChangeText={setBranch}
              px="xl"
              py="lg"
              rounded="circle"
              focusBorderColor="blue700"
              suffix={<Feather name="git-branch" size={24} color="#cbd5e0" />}
            />
            <Button
              mt="lg"
              ml="md"
              px="xl"
              py="lg"
              bg="blue500"
              rounded="circle"
              color="white"
              shadow={2}
              onPress={() => {
                Alert.alert(
                  'Submit Data',
                  `Adding data in branch ${Branch} in online(database)`,
                  [
                    {
                      text: 'Cancel',
                      style: 'red',
                    },
                    {
                      /*
                  text: 'offline',
                  onPress:  () => {
                   setAData(getData(Branch))
                   console.log(AData)
                  }
                */
                    },
                    {
                      text: 'submit',
                      onPress: () => {
                        addData();
                      },
                      style: 'cancel',
                    },
                  ]
                );
              }}
              suffix={
                <Feather name="arrow-right-circle" size={15} color="white" />
              }>
              <Text color="white"> submit {'\t'}</Text>
            </Button>
            {/* <Button
              mt="lg"
              ml="md"
              h={40}
              w={40}
              bg="blue500"
              rounded="circle"
              color="white"
              onPress={() => navigation.navigate('Details')}
              shadow={2}>
              +
            </Button>*/}
          </Div>
        ) : (
          <Div
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            m={'2%'}
            row>
            <Button
              mt="lg"
              ml="md"
              px="xl"
              py="lg"
              bg="blue500"
              rounded="circle"
              color="white"
              shadow={2}
              onPress={() => {
                //console.log(route.params)
                let id = '';
                let data = [];
                let branch = '';
                try {
                  id = route.params.data[0].id;
                  data = route.params.data[0].Data;
                  branch = route.params.data[0].Branch;
                } catch {
                  id = route.params.data.id;
                  data = route.params.data.Data;
                  branch = route.params.data.Branch;
                }
                Alert.alert(
                  'Submit updated Data  ..!',
                  `Update data in branch id:${id} data:${branch} `,
                  [
                    {
                      text: 'Cancel',
                      style: 'red',
                    },
                    {
                      /*
                  text: 'offline',
                  onPress:  () => {
                   setAData(getData(Branch))
                   console.log(AData)
                  }
                */
                    },
                    {
                      text: 'submit',
                      onPress: () => {
                        updateddata(id, branch);
                      },
                      style: 'cancel',
                    },
                  ]
                );
              }}
              suffix={
                <Feather name="arrow-right-circle" size={15} color="white" />
              }>
              <Text color="white"> submit {'\t'}</Text>
            </Button>
            <Button
              mt="lg"
              ml="md"
              h={40}
              w={40}
              bg="blue500"
              rounded="circle"
              color="white"
              onPress={() => navigation.navigate('Details')}
              shadow={2}>
              +
            </Button>
          </Div>
        )}

        <Dropdown
          ref={dropdownRef}
          title={
            <Text mx="xl" color="gray500" pb="md">
              Edite detials
            </Text>
          }
          mt="md"
          pb="2xl"
          justifyContent="center"
          h={'90%'}
          showSwipeIndicator={false}
          roundedTop="xl"
          w={width}
          alignItems="center">
          <ScrollView>
            <View
              style={{
                width: width - 40,
                height: 200,
                marginLeft: 5,
                //borderColor: n[0].selected ? '#ff9d9d' : '#c2f5d0',
                borderWidth: 2,
                borderColor: '#e2e8f0',
                borderRadius: 10,
                color: 'black',
              }}>
              <View
                style={{
                  height: '25%',
                  width: '100%',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color="black"
                  mt="lg"
                  ml="xl">
                  {Subject}
                </Text>
                <Button
                  px="md"
                  py="sm"
                  mr="md"
                  mt="lg"
                  bg="#63b3ed"
                  rounded="circle"
                  color="white"
                  shadow={2}>
                  <Text fontWeight="bold" color="white">
                    {type}
                  </Text>
                </Button>
              </View>

              <Div
                w={160}
                px="sm"
                py="sm"
                mr="sm"
                mt="xs"
                ml="lg"
                alignItems="center"
                bg="#4299e1"
                rounded="circle"
                color="white"
                shadow={2}>
                <Text fontWeight="bold" color="white">
                  {stime}:{smtime} {sdn} - {etime}:{emtime} {edn}
                </Text>
              </Div>

              <Text m="lg" color="gray700">
                {Discriptions}
              </Text>
              <Div ml={'3%'} row>
                {/* <Button
                  px="md"
                  py="sm"
                  mr="md"
                  mt="lg"
                  bg="#cbd5e0"
                  rounded="circle"
                  color="white"
                  shadow={2}>
                  <Text fontWeight="bold" color="white">
                    Copy link
                  </Text>
                </Button>*/}
                <Button
                  px="md"
                  py="sm"
                  mr="lg"
                  mt="lg"
                  bg="blue500"
                  rounded="circle"
                  color="white"
                  suffix={
                    <Feather
                      name="arrow-right-circle"
                      mt="xs"
                      size={19}
                      color="white"
                    />
                  }
                  shadow={'lg'}>
                  <Text fontWeight="bold" color="white">
                    Attend session{'\t'}
                  </Text>
                </Button>
              </Div>
            </View>
            <ScrollView>
              <View style={{ marginBottom: '20%', justifyContent: 'center' }}>
                <Input
                  placeholder="Enter your name"
                  value={Name}
                  onChangeText={onChangeName}
                  w={'97%'}
                  mt="xl"
                  h={50}
                  focusBorderColor="blue700"
                  suffix={<Feather name="user" size={24} color="#a0aec0" />}
                  onFocus={() => {}}
                />
                <Input
                  placeholder="Enter subject name"
                  value={Subject}
                  onChangeText={onChangeSubject}
                  w={'97%'}
                  mt="lg"
                  focusBorderColor="blue700"
                  suffix={<Feather name="user" size={24} color="#a0aec0" />}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}>
                  <Input
                    placeholder="00"
                    keyboardType={'numeric'}
                    maxLength={2}
                    value={stime}
                    onChangeText={onChangestime}
                    w={'15%'}
                    mt="lg"
                    focusBorderColor="blue700"
                  />
                  <Input
                    placeholder="00"
                    keyboardType={'numeric'}
                    maxLength={2}
                    value={smtime}
                    onChangeText={onChangesmtime}
                    w={'15%'}
                    mt="lg"
                    ml="xs"
                    focusBorderColor="blue700"
                  />
                  <Input
                    placeholder="AM/PM"
                    value={sdn.toUpperCase()}
                    maxLength={2}
                    onChangeText={onChangesdn}
                    w={'15%'}
                    ml="xs"
                    mt="lg"
                    focusBorderColor="blue700"
                  />

                  <Text>
                    {' '}
                    {'\t'}:{'\t'}
                  </Text>
                  <Input
                    placeholder="00"
                    keyboardType={'numeric'}
                    maxLength={2}
                    value={etime}
                    onChangeText={onChangeetime}
                    w={'12%'}
                    mt="lg"
                    ml="xs"
                    focusBorderColor="blue700"
                  />
                  <Input
                    placeholder="00"
                    keyboardType={'numeric'}
                    maxLength={2}
                    value={emtime}
                    onChangeText={onChangeemtime}
                    w={'15%'}
                    mt="lg"
                    ml="xs"
                    focusBorderColor="blue700"
                  />
                  <Input
                    placeholder="AM/PM"
                    maxLength={2}
                    value={edn.toUpperCase()}
                    onChangeText={onChangeedn}
                    w={'15%'}
                    ml="xs"
                    mt="lg"
                    focusBorderColor="blue700"
                  />
                </View>
                <Input
                  placeholder="Discriptions"
                  value={Discriptions}
                  onChangeText={onChangeDiscriptions}
                  w={'97%'}
                  mt="lg"
                  focusBorderColor="blue700"
                  suffix={<Feather name="user" size={24} color="#a0aec0" />}
                />
                <Input
                  placeholder="http//:example.com   "
                  value={Link}
                  onChangeText={onChangelink}
                  w={'97%'}
                  mt="lg"
                  focusBorderColor="blue700"
                  suffix={<Feather name="user" size={24} color="#a0aec0" />}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}>
                  <Input
                    placeholder="type"
                    value={type}
                    onChangeText={onchangetype}
                    w={'48%'}
                    mt="lg"
                    focusBorderColor="blue700"
                    suffix={<Feather name="user" size={24} color="#a0aec0" />}
                  />
                  <Button
                    w={'48%'}
                    mt="lg"
                    ml="xs"
                    onPress={() => {
                      let temp = ['PM', 'AM'];
                      //console.log(temp.includes(sdn.toUpperCase()))
                      //console.log(smtime<=60 && emtime<=60)

                      if (
                        temp.includes(sdn.toUpperCase()) &&
                        temp.includes(edn.toUpperCase()) &&
                        stime <= 12 &&
                        etime <= 12 &&
                        smtime <= 60 &&
                        emtime <= 60
                      ) {
                        alert('validated');
                      } else {
                        alert('not valideted');
                      }

                      eval(`set${current}`)(eval(current).concat(Data));
                      dropdownRef.current.close();
                      // console.log(current, Data);
                    }}
                    suffix={
                      <Feather
                        name="arrow-right-circle"
                        mt="xs"
                        size={24}
                        color="white"
                      />
                    }>
                    <Text fontSize="3xl" fontWeight="bold" color="white">
                      submit{'\t'}
                    </Text>
                  </Button>
                </View>
              </View>
            </ScrollView>
          </ScrollView>
        </Dropdown>
      </View>
    </>
  );
}

export default function ({ navigation}) {
  return (
  <LiveTimebale.Provider value={"lite"}>
    <Stack.Navigator initialRouteName="Details">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
    </LiveTimebale.Provider>
  );
}

export{LiveTimebale}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '7%',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: '3%',
  },
});
