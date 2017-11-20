var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

var config = {
    apiKey: "AIzaSyDLlXJjbB99bWMaUyWq5o-t_kzAxobcbaA",
    authDomain: "multicam-tally.firebaseapp.com",
    databaseURL: "https://multicam-tally.firebaseio.com",
    projectId: "multicam-tally",
    storageBucket: "multicam-tally.appspot.com",
    messagingSenderId: "682322906139"
};

firebase.initializeApp(config);

export default firebase;
