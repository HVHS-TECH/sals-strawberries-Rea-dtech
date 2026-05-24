var GLOBAL_user;
console.log("Running Sal's Strawberries")

function writeForm() {
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


function submit() {

  if (!GLOBAL_user) {
    alert("Please log in first");
    return;
  }

  let uid = GLOBAL_user.uid;
  let username = GLOBAL_user.displayName;

  let servings = document.getElementById("fruitQuantity").value;
  let favFood1 = document.getElementById("favoriteFruit1").value;
  let favFood2 = document.getElementById("favoriteFruit2").value;
  let favFood3 = document.getElementById("favoriteFruit3").value;
  let chosenName = document.getElementById("name").value;

  console.log(username + "'s favorite food is " + favFood1);
  console.log(username + "'s favorite food is " + favFood2);
  console.log(username + "'s favorite food is " + favFood3);
  firebase.database().ref('/users/' + uid).set({
    username: username,
    chosenname: chosenName,
    favoriteFood1: favFood1,
    favoriteFood2: favFood2,
     favoriteFood3: favFood3,
    servings: servings
  })
    .then(() => {
      return firebase.database().ref('/popularFruits/' + uid)
      .set(favFood1);
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



function popular() {
  console.log("displaying all fav fruits");

  let div = document.getElementById("popular");

  firebase.database().ref('/popularFruits/')
    .once('value')
    .then(function (snapshot) {

      let users = snapshot.val();

      if (!users) {
        div.textContent = "No users found.";
        return;
      }

      let output = "";

      let keys = Object.keys(users);

      for (let i = 0; i < keys.length; i++) {

        let fruit = users[keys[i]];

        if (fruit) {
          output += fruit + "<br>";
        }
      }

      div.innerHTML = output;
    })
    .catch(function (error) {
      console.error(error);
    });
}


 setInterval(function () {

  if (GLOBAL_user) {
      let profile = GLOBAL_user.photoURL;
      let photo = document.getElementById("profilephoto")
      photo.src = GLOBAL_user.photoURL;
      photo.innerHTML = profile;
      console.log(profile);

  } else {

    console.log("log in first");

  }

}, 5000);
