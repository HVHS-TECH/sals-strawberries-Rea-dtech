
var GLOBAL_user;
console.log("Running Sal's Strawberries")

function writeForm(){
    // Get the form data
    const favoriteFruit = document.getElementById("favoriteFruit").value;
}




//listener for login state
function fb_login() {
  authenticationListener = firebase.auth().onAuthStateChanged(fb_handleLogin);
}

//run when login state of user changes
function fb_handleLogin(_user) {
  if (_user) {
    console.log("User is logged in")
    GlOBAL_user = _user; //save the object to a global varible

  } else {

    console.log("User is not logged in - starting the popup process")
    fb_popupLogin();
  }
}

// run the google login prompt
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


function favfood() {

  if (!GLOBAL_user) {
    alert("Please log in first");
    return;
  }

  let username = GLOBAL_user.displayName;

  // Get value from input field
  let favFood = document.getElementById("favoriteFruit").value;

  console.log(username + "'s favorite food is " + favFood);

  firebase.database().ref('/users/favfood/' + username).set(favFood)
    .then(() => {
      console.log("wrote to database");
    })
    .catch((error) => {
      console.error("Database write failed:", error);
    });
}

  function email() {
    if(GLOBAL_user) {
    console.log("email")
    let div = document.getElementById("myDiv");
    let emailcontent = document.getElementById("emailcontent")
    div.innerHTML = "to: " + GLOBAL_user.email;
    emailcontent.innerHTML = "Welcome to Reas website"

  }else {
    alert("error user is not logged in")
  }
  }

  function  popular(){
    console.log("displaying all fav fruits")
    firebase.database().ref('/')
    
  }