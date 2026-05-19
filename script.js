var GLOBAL_user;
console.log("Running Sal's Strawberries")

function writeForm(){
    const favoriteFruit = document.getElementById("favoriteFruit").value;
}


// listener for login state
function fb_login() {
  authenticationListener = firebase.auth().onAuthStateChanged(fb_handleLogin);
}


// run when login state changes
function fb_handleLogin(_user) {
  if (_user) {
    console.log("User is logged in")
    GLOBAL_user = _user;
  } else {
    console.log("User is not logged in - starting the popup process")
    fb_popupLogin();
  }
}


// Google login popup
function fb_popupLogin() {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then((result) => {
    GLOBAL_user = result.user;
    console.log("User has logged in")
  });
}


function hello() {
  if (GLOBAL_user) {
    console.log(GLOBAL_user.displayName);
  } else {
    console.log("log in first");
  }
}


// SAVE DATA (UID CHANGE HERE)
function submit() {

  if (!GLOBAL_user) {
    alert("Please log in first");
    return;
  }

  let uid = GLOBAL_user.uid; 
  let username = GLOBAL_user.displayName;

  let servings = document.getElementById("fruitQuantity").value;
  let favFood = document.getElementById("favoriteFruit").value;
  let chosenName = document.getElementById("name").value;

  console.log(username + "'s favorite food is " + favFood);

  firebase.database().ref('/users/' + uid).set({  
    username: username,
    chosenname: chosenName,
    favoriteFood: favFood,
    servings: servings

  })
  .then(() => {
    console.log("Wrote the users chosen name and favorite food and servings to database");
  })
  .catch((error) => {
    console.error("Database write failed:", error);
  });

}


function email() {

  if (GLOBAL_user) {

    console.log("email");

    let div = document.getElementById("email");

    let uid = GLOBAL_user.uid; 

    firebase.database().ref('/users/' + uid) 
      .once('value')
      .then((snapshot) => {

        let user = snapshot.val();

        if (user) {

          div.textContent =
            "to: " + user.chosenname +
            " your fav food is " + user.favoriteFood +
            " and you enjoy having " + user.servings +
            " per week.";

        } else {
          div.textContent = "User data not found.";
        }

      })
      .catch((error) => {
        console.error("Database read failed:", error);
      });

  } else {
    alert("error user is not logged in")
  }
}


// still works (no UID needed here yet)
function popular(){
  console.log("displaying all fav fruits")
  firebase.database().ref('/users')
}


