var GLOBAL_user;


function fb_login() {

  authenticationListener =
    firebase.auth().onAuthStateChanged(fb_handleLogin);

}


// runs when login state changes
function fb_handleLogin(_user) {

  if (_user) {

    console.log("User is logged in");

    GLOBAL_user = _user;

  } else {

    console.log("User is not logged in");

    fb_popupLogin();

  }
}


// Google login popup
function fb_popupLogin() {

  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {

      GLOBAL_user = result.user;

      console.log("User has logged in");

    })
    .catch((error) => {

      console.error("Login failed:", error);

    });
}














async function infomation() {

  try {

    if (GLOBAL_user) {

      console.log("info");

      let div = document.getElementById("infomation");

      let uid = GLOBAL_user.uid;

      let snapshot = await firebase.database()
        .ref('/users/' + uid)
        .once('value');

      let user = snapshot.val();

      if (user) {

        div.textContent =

            user.chosenname + "," +

           

          user.favoriteFood1 + ", " +

          user.favoriteFood2 + ", " +

          user.favoriteFood3 +

          user.servings ;

      } else {

        div.textContent = "User data not found.";

      }

    } else {

      let div = document.getElementById("infomation");

      div.textContent = "Please log in first.";

    }

  } catch (error) {

    console.error("Database read failed:", error);

    let div = document.getElementById("infomation");

    div.textContent = "Error loading data: " + error.message;

  }
}



setInterval(function () {

  if (GLOBAL_user) {

    let photo =
      document.getElementById("profilephoto");

    // safely set image source
    photo.src = GLOBAL_user.photoURL;

    console.log(GLOBAL_user.photoURL);

  } else {

    console.log("log in first");

  }

}, 5000);