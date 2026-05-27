var GLOBAL_user;

console.log("Running Sal's Strawberries");


// =========================
// Login Functions
// =========================

// listens for login changes
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


// test function
function hello() {

  if (GLOBAL_user) {

    console.log(GLOBAL_user.displayName);

  } else {

    console.log("log in first");

  }
}


// =========================
// Submit User Data
// =========================

async function submit() {

  try {

    // make sure user is logged in
    if (!GLOBAL_user) {

      alert("Please log in first");

      return;

    }

    let uid = GLOBAL_user.uid;

    let username = GLOBAL_user.displayName;

    // get values from inputs
    let servings = Number(
      document.getElementById("fruitQuantity").value
    );

    let favFood1 =
      document.getElementById("favoriteFruit1").value;

    let favFood2 =
      document.getElementById("favoriteFruit2").value;

    let favFood3 =
      document.getElementById("favoriteFruit3").value;

    let chosenName =
      document.getElementById("name").value;

    let review =
      document.getElementById("reviews").value.trim();


    // number validation
    if (
      isNaN(servings) ||
      servings < 1 ||
      servings > 100
    ) {

      alert("Invalid servings number");

      return;

    }


    console.log(username + "'s favorite food is " + favFood1);
    console.log(username + "'s favorite food is " + favFood2);
    console.log(username + "'s favorite food is " + favFood3);


    // save private user data
    await firebase.database().ref('/users/' + uid).set({

      username: username,
      chosenname: chosenName,

      favoriteFood1: favFood1,
      favoriteFood2: favFood2,
      favoriteFood3: favFood3,

      servings: servings

    });


    // save popular fruit
    await firebase.database()
      .ref('/popularFruits/' + uid)
      .set(favFood1);


    // save public review
    await firebase.database()
      .ref('/reviews/' + uid)
      .set({

        username: chosenName,
        review: review

      });


    console.log(
      "Wrote user data, fruits, and review to database"
    );

  } catch (error) {

    console.error("Database write failed:", error);

  }
}


// =========================
// Display User Email Info
// =========================

function email() {

  if (GLOBAL_user) {

    console.log("email");

    let div = document.getElementById("email");

    let uid = GLOBAL_user.uid;

    firebase.database()
      .ref('/users/' + uid)
      .once('value')

      .then((snapshot) => {

        let user = snapshot.val();

        if (user) {

          div.textContent =

            "to: " + user.chosenname +

            " your fav foods are " +

            user.favoriteFood1 + ", " +

            user.favoriteFood2 + ", " +

            user.favoriteFood3 +

            " and you enjoy having " +

            user.servings +

            " per week.";

        } else {

          div.textContent = "User data not found.";

        }

      })

      .catch((error) => {

        console.error(
          "Database read failed:",
          error
        );

      });

  } else {

    alert("error user is not logged in");

  }
}


// =========================
// Display Popular Fruits
// =========================

function popular() {

  console.log("displaying all fav fruits");

  let div = document.getElementById("popular");

  firebase.database()
    .ref('/popularFruits/')
    .once('value')

    .then(function (snapshot) {

      let users = snapshot.val();

      if (!users) {

        div.textContent = "No users found.";

        return;

      }

      // clear old content safely
      div.innerHTML = "";

      let keys = Object.keys(users);

      for (let i = 0; i < keys.length; i++) {

        let fruit = users[keys[i]];

        if (fruit) {

          // safe XSS-free rendering
          let p = document.createElement("p");

          p.textContent = fruit;

          div.appendChild(p);

        }
      }
    })

    .catch(function (error) {

      console.error(error);

    });
}


// =========================
// Update Profile Picture
// =========================

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


// =========================
// Load Reviews
// =========================

async function loadReviews() {

  try {

    let div =
      document.getElementById("allReviews");

    // clear old reviews
    div.innerHTML = "";

    let snapshot = await firebase.database()
      .ref('/reviews/')
      .once('value');

    let users = snapshot.val();

    if (!users) {

      div.textContent = "No reviews found.";

      return;

    }

    let keys = Object.keys(users);

    for (let i = 0; i < keys.length; i++) {

      let user = users[keys[i]];

      if (user.review) {

        // create review box
        let reviewBox =
          document.createElement("div");

        // username
        let name =
          document.createElement("h3");

        name.textContent = user.username;

        // review text
        let review =
          document.createElement("p");

        review.textContent = user.review;

        // add elements
        reviewBox.appendChild(name);

        reviewBox.appendChild(review);

        div.appendChild(reviewBox);

      }
    }

  } catch (error) {

    console.error(
      "Loading reviews failed:",
      error
    );

  }
}