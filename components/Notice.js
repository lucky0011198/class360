import * as React from 'react';
import { useState, useEffect, useCallback, createContext } from 'react';
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
} from 'react-native';

import Checkbox from 'expo-checkbox';
//import * as firebase from 'firebase';

//import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';
import BottomSheet from 'reanimated-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWindowDimensions } from 'react-native';
import { useFonts } from 'expo-font';

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
} from 'react-native-magnus';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
const dropdownRef = React.createRef();

import { auth, storage, User } from '../firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

//iconse ...

import {
  AntDesign,
  MaterialCommunityIcons,
  Octicons,
  Ionicons,
  MaterialIcons,
  Feather,
  Entypo,
} from '@expo/vector-icons';

function EditeScreen({ route, navigation }) {
  const [visible, setVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [Color, setcolor] = useState('#ffff');
  const [Type, setType] = useState('');
  const [Title, setTitle] = useState('');
  const [Content, setContent] = useState('');
  const [Lable, setLable] = useState('');
  const [Lables, setLables] = useState([]);
  const [Pin, setPin] = useState(false);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  let color = [
    '#ffff',
    '#f7fafc',
    '#fefcbf',
    '#c6f6d5',
    '#b2f5ea',
    '#fed7d7',
    '#feebc8',
    '#bee3f8',
    '#c3dafe',
    '#e9d8fd',
    '#fed7e2',
  ];
  const [Show, setshow] = useState(true);

  useEffect(() => {
    if (typeof route.params != 'undefined') {
      console.log(route.params);
    }
  }, []);

  function getDate(year, month, day, hours, minutes, str) {
    if (str.toLowerCase() == 'pm') {
      hours = hours + 12;
      if (hours == 24) {
        hours = 0;
      }
    }
    return new Date(year, month, day, hours, minutes, 0, 0);
  }


  return (
    <SafeAreaView>
      <View
        style={{
          height: '100%',
          width: '100%',
          marginTop: '2%',
          backgroundColor: Color,
        }}>
        <View
          style={{
            width: '100%',
            height: '10%',
            marginTop: '7%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            //backgroundColor: 'blue',
          }}>
          <TouchableHighlight
            style={{
              height: '50%',
              width: '10%',
              marginTop: '6%',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 3,
              borderRadius: 100,
            }}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="back" />
          </TouchableHighlight>
          <Div mr={5} row>
           
            {/*<Button
              bg="transparent"
              h={40}
              w={40}
              rounded="circle"
              ml="md"
              p={0}
               onPress={showTimepicker}
              >
              <MaterialCommunityIcons
                name="bell-plus-outline"
                size={24}
                color="#4a5568"
              />
            </Button>*/}
            <Button
              bg="transparent"
              h={40}
              w={40}
              rounded="circle"
              ml="md"
              p={0}
              onPress={() => {
                navigation.push('Uploadefile');
              }}>
              <Ionicons name="file-tray-full-outline" size={24} color="black" />
            </Button>
          </Div>
        </View>
        <View style={{ margin: '3%' }}>
          {Type ? (
            <Tag
              bg="transparent"
              mt={'md'}
              ml="70%"
              prefix={<AntDesign name="warning" size={15} color="black" />}>
              <Text>
                {'\t'}
                {Type}
              </Text>
            </Tag>
          ) : null}
          <Div justifyContent="space-between" flexWrap="wrap" row>
            <TextInput
              style={{ marginLeft: 10, fontSize: 20, marginTop: '5%' }}
              onChangeText={setTitle}
              placeholder="Title"
            />
          </Div>
          <TextInput
            style={{ marginLeft: 10, marginTop: '3%' }}
            onChangeText={setContent}
            multiline={true}
            placeholder="create a notice..."
          />
          <Div flexWrap="wrap" mt="xl" w={'60%'} row>
            {typeof route.params != 'undefined'
              ? route.params
                  .filter((i) => i.selected)
                  .map((n) => (
                    <View
                      style={{
                        backgroundColor: Color == '#ffff' ? '#b2f5ea' : '#ffff',
                        borderRadius: 10,
                        marginTop: '3%',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: 50,
                          justifyContent: 'center',
                        }}>
                        <Button
                          bg="transparent"
                          h={'100%'}
                          w={40}
                          rounded="circle"
                          ml="md"
                          mr="md"
                          justifyContent="center"
                          p={0}>
                          <AntDesign
                            name="filetext1"
                            size={20}
                            color="#319795"
                          />
                        </Button>

                        <Div h={'100%'} justifyContent="center">
                          <Text color="gray700" h={'100%'}>
                            {n.Name}
                          </Text>
                        </Div>
                        <Button
                          bg="transparent"
                          h={'100%'}
                          w={40}
                          p={0}
                          onPress={() => {
                            //navigation.navigate('View',n)
                            WebBrowser.openBrowserAsync(`${n.url}`);
                          }}>
                          <AntDesign name="export" size={20} color="black" />
                        </Button>
                      </View>
                    </View>
                  ))
              : null}
          </Div>

          <Div mt="xl" w={'80%'} flexWrap="wrap" row>
            {Lables.length != 0
              ? Lables.filter((k) => k.selected == true).map((j) => (
                  <Tag
                    bg={Color == '#ffff' ? '#b2f5ea' : '#ffff'}
                    ml="xs"
                    prefix={
                      <Feather
                        name="git-branch"
                        size={15}
                        color={Color == '#ffff' ? 'black' : '#319795'}
                      />
                    }
                    borderColor={Color == '#ffff' ? '#319795' : Color}
                    borderWidth={1}>
                    <Text color="#727273">
                      {' '}
                      {'\t'}
                      {j.Lable}
                    </Text>
                  </Tag>
                ))
              : null}
          </Div>
        </View>
      </View>
      <Overlay visible={overlayVisible} p="xl">
        <ActivityIndicator />
        <Text mt="md">Loading...</Text>
      </Overlay>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          top: '93%',
          width: '90%',
          marginLeft: '5%',
        }}>
        <Octicons
          name="diff-added"
          size={24}
          color="#4a5568"
          onPress={() => dropdownRef.current.open()}
        />
        <Text>
          {' '}
          Edited{' '}
          {new Date().getHours() > 12
            ? new Date().getHours() - 12
            : new Date().getHours()}
          :
          {new Date().getMinutes() < 10
            ? '0' + new Date().getMinutes()
            : new Date().getMinutes()}
          {new Date().getHours() > 12 ? ' am' : ' pm'}
        </Text>
        <Button
          ml="md"
          p={5}
          px="lg"
          h={'100%'}
          bg="#b2f5ea"
          rounded="circle"
          color="white"
          shadow={2}
          prefix={<AntDesign name="clouduploado" size={24} color="#38b2ac" />}
          onPress={() => {
            let selectLable = Lables.filter((i) => i.selected);
            let gettime = ` Edited
          ${
            new Date().getHours() > 12
              ? new Date().getHours() - 12
              : new Date().getHours()
          }
          :
          ${
            new Date().getMinutes() < 10
              ? '0' + new Date().getMinutes()
              : new Date().getMinutes()
          }
          ${new Date().getHours() >= 12 ? 'pm' : ' am'}`;

            let getdate = `${new Date().getUTCMonth()}:${new Date().getMonth()}:${new Date().getFullYear()}`;

            try {
              setOverlayVisible(true);
              if (typeof route.params != 'undefined') {
                User.add({
                  Color,
                  Type,
                  Lables: selectLable,
                  Title,
                  Content,
                  gettime,
                  Files: route.params.filter((i) => i.selected),
                  date: new Date(),
                  Pin,
                }).then(() => {
                  setOverlayVisible(false);
                  alert('data added ..!');
                });
              }
            } catch (e) {
              console.log(e);
            }
          }}>
          <Text> {'\t'}update</Text>
        </Button>
      </View>
      <Dropdown ref={dropdownRef} pb="xl" showSwipeIndicator={false}>
        <Dropdown.Option
          py="md"
          px="xl"
          onPress={() => {
            navigation.navigate('Home');
          }}
          prefix={<AntDesign name="delete" size={20} color="black" />}
          block>
          <Text fontSize="xl"> {'\t'}Delete</Text>
        </Dropdown.Option>
        <Dropdown.Option
          py="md"
          px="xl"
          mt="md"
          prefix={
            <MaterialIcons name="label-outline" size={23} color="black" />
          }
          onPress={() => setVisible(true)}
          block>
          <Text fontSize="xl"> {'\t'}Lable</Text>
        </Dropdown.Option>
        <Dropdown.Option py="md" px="xl" mt="md" block>
          <Text fontSize="md">
            <Ionicons name="color-palette-outline" size={16} color="black" />
            {'\t'} select backgroundColor
          </Text>
        </Dropdown.Option>

        <Div flexWrap="wrap" row>
          {color.map((i) => (
            <Button
              h={30}
              w={30}
              rounded="xl"
              onPress={() => {
                setcolor(i);
              }}
              bg={i}
              m={10}
            />
          ))}
        </Div>
        <Dropdown.Option py="md" px="xl" mt="md" block>
          <Text fontSize="md">
            {' '}
            <AntDesign name="warning" size={15} color="black" /> {'\t'} select
            notice type
          </Text>
        </Dropdown.Option>
        <Div justifyContent="center" mt="md" alignItems="center">
          <Radio.Group flexWrap="wrap" row>
            {['alert', 'importent', 'urgent', 'warning'].map((item) => (
              <Radio
                value={item}
                onPress={(value) => {
                  setType(item);
                }}>
                {({ checked }) => (
                  <Div
                    bg={checked ? 'blue600' : 'blue100'}
                    px="md"
                    py="md"
                    mr="xl"
                    mt={7}
                    rounded="circle">
                    <Text color={checked ? 'white' : 'gray800'}>{item}</Text>
                  </Div>
                )}
              </Radio>
            ))}
          </Radio.Group>
        </Div>
      </Dropdown>
      <Modal isVisible={visible} style={{ backgroundColor: '#DDDDD' }}>
        <Header
          borderBottomWidth={1}
          borderBottomColor="gray200"
          prefix={
            <TouchableHighlight
              style={{
                height: 40,
                width: 40,
                marginTop: '3%',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 3,
                borderRadius: 100,
              }}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={() => {
                setVisible(false);
              }}>
              <AntDesign name="arrowleft" size={24} color="#2d3748" />
            </TouchableHighlight>
          }>
          <TextInput
            onChangeText={setLable}
            onEndEditing={() => {
              setLables(Lables.concat({ Lable, selected: true }));
            }}
            style={{ marginLeft: '5%', fontSize: 15 }}
            placeholder="Enter Lable name"
          />
        </Header>

        {Lables.map((i) => (
          <Div
            w={'100%'}
            h={'5%'}
            mt={'2%'}
            justifyContent="space-between"
            flexDirection="row"
            flexWrap="wrap">
            <Div
              justifyContent="center"
              alignItems="center"
              ml="xl"
              flexWrap="wrap"
              row>
              <MaterialIcons name="label-outline" size={24} color="black" />
              <Text fontSize="xl" ml="xl">
                {i.Lable}
              </Text>
            </Div>
            <CheckBox
              disabled={false}
              onAnimationType="fill"
              offAnimationType="fade"
              value={i.selected}
              onValueChange={() => {
                const newlist = Lables.map((newitem) => {
                  if (newitem.Lable == i.Lable) {
                    return {
                      ...newitem,
                      selected: !newitem.selected,
                    };
                  }

                  return {
                    ...newitem,
                    selected: newitem.selected,
                  };
                });

                setLables(newlist);
              }}
              tintColors={{ true: '#90cdf4', false: '#2d3748' }}
              style={{ marginRight: 20 }}
            />
          </Div>
        ))}
      </Modal>
    </SafeAreaView>
  );
}

function HomeScreen({ navigation }) {
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
          backgroundColor={item.Data.Color}>
         
          <Div justifyContent="space-between" flexWrap="wrap" w="98%" row>
            <Div m="md" row>
              <Button
                bg={item.Data.Color == '#ffff' ? '#fed7d7' : '#ffff'}
                h={30}
                w={30}
                p={0}
                rounded="circle"
                onPress={() => {
                  const dbRef = User.doc(item.id);
                  dbRef.delete().then((res) => {
                    alert('Item removed from database');
                  });
                }}>
                <AntDesign name="delete" size={15} color="black" />
              </Button>
            </Div>
            <Button
              px="lg"
              py="xs"
              mt="lg"
              bg="#e6fffa"
              rounded="circle"
              color="black"
              prefix={<AntDesign name="warning" size={15} color="#4fd1c5" />}
              shadow={2}>
              <Text fontWeight="bold" color="black">
                {'\t'}
                {item.Data.Type}
              </Text>
            </Button>
          </Div>
          <Div justifyContent="space-between" mt="lg" ml="lg" mr="lg" row>
            <Text fontWeight="bold" fontSize="xl">
              {item.Data.Title}{' '}
            </Text>
          </Div>
          <Text mt="xs" m="lg" color="gray700">
            {item.Data.Content}
          </Text>

         <Div flexWrap="wrap" row>
            {item.Data.Lables.map((k) => (
              <Tag
                bg={item.Data.Color == '#ffff' ? '#b2f5ea' : '#ffff'}
                mt={'md'}
                ml="2%"
                prefix={<Feather name="git-branch" size={15} color="black" />}>
                <Text>
                  {'\t'}
                  {k.Lable}
                </Text>
              </Tag>
            ))}
          </Div>
          
          {
            typeof item.Data.Files!='undefined'?<Div flexWrap="wrap" row>
            {item.Data.Files.map((j) => (
              <Tag
                bg={item.Data.Color == '#ffff' ? '#b2f5ea' : '#ffff'}
                mt={'md'}
                ml="2%"
                mb="lg"
                onPress={() => {
                  WebBrowser.openBrowserAsync(j.url);
                }}
                prefix={<AntDesign name="filetext1" size={15} color="black" />}>
                <Text>
                  {'\t'}
                  {j.Name}
                </Text>
              </Tag>
            ))}
          </Div>:null
          }
        </Div>
        
      );
    }



  return (
    <>
    <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loaddata} />
        }
        style={{ backgroundColor: 'transparent', marginBottom: '10%'}}>
        <Div  flexWrap="wrap" display="flex" bg="transparent">
          {data.length != 0 ? (
            <FlatList
              data={multiDimensionalUnique(data)}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={{ width: '100%', marginBottom: '5%' }}
            />
          ) : null}
        </Div>
      </ScrollView>
      <View style={styles.inputsection}>
        <TextInput
          style={{ marginLeft: 10}}
          onFocus={() => {
            navigation.navigate('Edite');
          }}
          placeholder="create a notice..."
        />
      </View>
    </>
  )
}
function UploadefileScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [Storage, setStorage] = useState([]);
  const [select, setselect] = useState([]);

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

  const selectfie = () => {
    storage.listAll().then((res) => {
      res.items.map((i) => {
        storage
          .child(i.toString().split('/')[i.toString().split('/').length - 1])
          .getDownloadURL()
          .then((url) => {
            setStorage((p) => [
              ...p,
              {
                url,
                Name: `${
                  i.toString().split('/')[i.toString().split('/').length - 1]
                }`,
              },
            ]);
          });
      });
    });
  };

  useEffect(() => {
    selectfie();
  }, []);

  return (
    <View style={styles.container}>
      {Storage.length != 0
        ? multiDimensionalUnique(Storage).map((i) => (
            <>
              <View style={styles.items}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: '100%',
                    justifyContent: 'center',
                  }}>
                  <Button
                    bg="transparent"
                    h={'100%'}
                    w={40}
                    rounded="circle"
                    ml="md"
                    mr="md"
                    justifyContent="center"
                    p={0}>
                    <Entypo name="icloud" size={20} color="black" />
                  </Button>
                  <Div h={'100%'} justifyContent="center">
                    <Text color="gray700" ml="xs" h={'100%'}>
                      {i.Name}
                    </Text>
                  </Div>
                </View>

                <Div h={'100%'} justifyContent="center" row>
                  <Button
                    bg="transparent"
                    h={'100%'}
                    w={40}
                    p={0}
                    onPress={() => {
                      console.log('yes');
                    }}>
                    <AntDesign name="delete" size={20} color="black" />
                  </Button>
                  <Button
                    bg="transparent"
                    h={'100%'}
                    w={40}
                    p={0}
                    onPress={() => {
                      //navigation.navigate('View',i)
                      WebBrowser.openBrowserAsync(`${i.url}`);
                    }}>
                    <AntDesign name="export" size={20} color="black" />
                  </Button>
                  <Div h={'100%'} justifyContent="center">
                   <Checkbox
                      disabled={false}
                      onAnimationType="fill"
                      offAnimationType="fade"
                      value={i.selected}
                      onValueChange={() => {
                        const newlist = Storage.map((newitem) => {
                          if (newitem.Name == i.Name) {
                            return {
                              ...newitem,
                              selected: !newitem.selected,
                            };
                          }

                          return {
                            ...newitem,
                            selected: newitem.selected,
                          };
                        });

                        setStorage(newlist);
                      }}
                    />
                  </Div>
                </Div>
              </View>
            </>
          ))
        : null}

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Edite', Storage);
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>submit files</Text>
      </TouchableOpacity>
    </View>
  );
}

function ViewScreen({ route, navigation }) {
  //console.log(route.params.url)
  return (
    <WebView
      source={{
        uri: 'https://reactnativemaster.com/wp-content/uploads/2020/02/React-native-document-viewer-pdf-sample.pdf',
      }}
    />
  );
}
export default function ({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '   Notice Board',
          headerLeft: () => (
            <Button
              bg="#e6fffa"
              h={40}
              w={40}
              rounded="circle"
              ml="md"
              p={0}
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name="Edite"
        component={EditeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="View" component={ViewScreen} />
      <Stack.Screen
        name="Uploadefile"
        component={UploadefileScreen}
        options={{ title: 'Cloud storage' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  inputsection: {
    flexDirection: 'row',
    position: 'absolute',
    top: '90%',
    backgroundColor: 'white',
    height: '10%',
    opacity: 0.7,
    width: '100%',
  },
  container: {
    flex: 1,
    marginTop: '3%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  items: {
    width: '94%',
    height: '6%',
    justifyContent: 'space-between',
    backgroundColor: '#DDDD',
    marginTop: '2%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 5,
  },
});
