/**************************************************************
 **************************************************************
 **                                                          **
 ** fb_io.js is where you will put common firebase functions **
 ** used throughout your code.                               **
 **                                                          **
 **************************************************************
 **************************************************************/

    // authenticate with Google

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-zPhYs6t9fGghJrWYlJNd_Kl7MohUK5c",
  authDomain: "rea-sevicke-jones-12comp.firebaseapp.com",
  databaseURL: "https://rea-sevicke-jones-12comp-default-rtdb.firebaseio.com",
  projectId: "rea-sevicke-jones-12comp",
  storageBucket: "rea-sevicke-jones-12comp.firebasestorage.app",
  messagingSenderId: "401505880913",
  appId: "1:401505880913:web:3ce4f923667b2201bee170"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);




function fb_error(){
    // Don't forget your error handling!
}