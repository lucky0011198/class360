import * as firebase from "firebase";

const firebaseConfig = {
  /* enter youre fire base config*/
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
