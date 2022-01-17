// const { set, ref } = require("@firebase/database");

const firebaseConfig = {
    apiKey: "AIzaSyAwlv1-TlCCIMOxWvGadtP6Bv2v68cJYNo",
    authDomain: "onspot-472c7.firebaseapp.com",
    databaseURL: "https://onspot-472c7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "onspot-472c7",
    storageBucket: "onspot-472c7.appspot.com",
    messagingSenderId: "399505477715",
    appId: "1:399505477715:web:5d75f2dbf51a9307ae76a6"
  };
  
  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const appSecondary = firebase.initializeApp(firebaseConfig,'temporary');
const auth = firebase.auth();
const db = firebase.database();
const dbf = firebase.firestore();


//user account elements
const accBox = document.getElementById("user_panel-account-container");
const loginBox = document.getElementById("user_panel-account-login");
const registerBox = document.getElementById("user_panel-account-register");

const loginBtn = document.getElementById("btn_login");
const regBtn = document.getElementById("btn_reg");
const regBtnOpen = document.getElementById("btn_open-register")
const regBackBtn = document.getElementById("btn_reg-back");
const logOutBtn = document.getElementById('btn_logout');
const usrSettings = document.getElementById('user_settings');

const accMain = document.getElementById("user_panel-account");

const alrtLogin = document.getElementById("login-alert");
const alrtReg = document.getElementById("register-alert");
const successReg = document.getElementById("register-success");

function login(){

  let email = document.getElementById("email_field").value;
  let password = document.getElementById("password_field").value;
  
  alrtLogin.classList.add('hidden');

  auth.signInWithEmailAndPassword( email, password)
            .then((userCredential) => {
              //let user = firebase.auth().currentUser;

              // accMain.insertAdjacentHTML('afterbegin', `<div id="user_pannel-account-loggedin" class="w-full h-full"><div class=" text-2xl text-white text-center mt-4"> <h1>Hello, ${user.displayName} </h1></div> </div>`);
              // accBox.classList.add('hidden');
              // logOutBtn.classList.remove('hidden'); 
              // document.getElementById('user_notes-unsigned').classList.add('hidden');
              // document.getElementById('user_notes-logged').classList.remove('hidden');
              
            })
            .catch((error) => {
              alrtLogin.classList.remove('hidden');
              alrtLogin.innerText = error.message;
            });
}

function register(){
      let email = document.getElementById("register_email_field").value;
      let password = document.getElementById("register_password_field").value;
      let password2 = document.getElementById("register_password_field_2").value;
    
      if(password===password2){
        appSecondary.auth().createUserWithEmailAndPassword( email, password)
            .then((userCredential) => {
              var user = appSecondary.auth().currentUser;
              user.updateProfile({
                  displayName: document.getElementById("register_username_field").value
              })

              appSecondary.auth().signOut();

              successReg.classList.remove('hidden');
              successReg.innerText = "Account created! You can now log in.";
              alrtReg.classList.add('hidden');
              // console.log(userCredential.user)
              accBack();
              // writeUserToDb();
              
              db.ref('users/' + user.uid).set({
                  noteCount: 0,
                  notes: 'null',
                });
              
              // auth.signOut();
            })
            .catch((error) => {
              successReg.classList.remove('hidden');
              alrtReg.classList.remove('hidden');
              alrtReg.innerText = error.message;
            });
      }
      else{
          alrtReg.classList.remove('hidden');
          alrtReg.innerText = "Passwords are not the same.";
      }
}

app.auth().onAuthStateChanged((user) => {
  if (user) {
    accMain.insertAdjacentHTML('afterbegin', `<div id="user_pannel-account-loggedin" class="w-full "><div class=" text-2xl text-white text-center mt-4"> <h1>Hello, ${user.displayName} </h1></div> </div>`);
              accBox.classList.add('hidden');
              logOutBtn.classList.remove('hidden'); 
              usrSettings.classList.remove('hidden');
              document.getElementById('user_notes-unsigned').classList.add('hidden');
              document.getElementById('user_notes-logged').classList.remove('hidden');
    document.getElementById('options').classList.remove('hidden')
    
  } 
  else {
    accBox.classList.remove('hidden');
    logOutBtn.classList.add('hidden');
    usrSettings.classList.add('hidden');
    document.getElementById('user_notes-unsigned').classList.remove('hidden');
    document.getElementById('user_notes-logged').classList.add('hidden');
    document.getElementById('options').classList.add('hidden')

  }
});


function logOut() {
  auth.signOut().then(()=>{

    // accBox.classList.remove('hidden');
    // logOutBtn.classList.add('hidden');
    // document.getElementById('user_notes-unsigned').classList.remove('hidden');
    // document.getElementById('user_notes-logged').classList.add('hidden');

    console.log("Logout succesful");
    document.getElementById('user_pannel-account-loggedin').remove();
    
    }).catch((error) => {
      alert(error.message);
  });
};


function fadeRegister() {
  accBox.prepend(registerBox);
  accBox.classList.remove('opacity-0','lg:-translate-x-2');
  accBox.removeEventListener('transitionend', fadeRegister)
}

function openRegister() {
  accBox.classList.add('opacity-0','lg:-translate-x-2')
  accBox.addEventListener('transitionend', fadeRegister)

}

function fadeBck() {
  accBox.prepend(loginBox);
  accBox.classList.remove('opacity-0','lg:-translate-x-2');
  accBox.removeEventListener('transitionend', fadeBck);
}

function accBack() {
  accBox.classList.add('opacity-0','lg:-translate-x-2');
  accBox.addEventListener('transitionend', fadeBck);
}


loginBtn.addEventListener('click', login);
regBtn.addEventListener('click', register);
regBtnOpen.addEventListener('click',openRegister);
regBackBtn.addEventListener('click', accBack);
logOutBtn.addEventListener('click', logOut);



// Database
// function writeUserToDb() {
//   set(ref(database, 'users/' + userId),{
//     username: user.uid,
//   });
// }