import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyANR34rHe_H9uLf8NDg6LCPyUCybXo581k",
  authDomain: "eco-signal-327516.firebaseapp.com",
  projectId: "eco-signal-327516",
  storageBucket: "eco-signal-327516.appspot.com",
  messagingSenderId: "1078242764328",
  appId: "1:1078242764328:web:a3351c617e072c4ba1b71d",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const storage = firebase.storage().ref("files/img");
const db = firebase.firestore();
const User = db.collection("Notice");
const Timetableuser = db.collection("Timetable");
const Attendance = db.collection("Attendance");
const Users = db.collection("Users");
const ClassAttendance = db.collection("ClassAttendance");

export {
  auth,
  storage,
  User,
  Timetableuser,
  Attendance,
  Users,
  ClassAttendance,
};
