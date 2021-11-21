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
const auth = firebase.auth();

const accMain = document.getElementById("user_panel-account");

  //user account alerts
const alrtLogin = document.getElementById("login-alert");
const alrtReg = document.getElementById("register-alert");
const successReg = document.getElementById("register-success");


function login(){

  email = document.getElementById("email_field").value;
  password = document.getElementById("password_field").value;
  
  alrtLogin.classList.add('hidden');

    auth.signInWithEmailAndPassword( email, password)
            .then((userCredential) => {
              // console.log(userCredential.user)
              const user = firebase.auth().currentUser;
              accMain.insertAdjacentHTML('afterbegin', `<div id="user_pannel-account-loggedin" class="w-full h-full"><div class=" text-2xl text-white"> <h1>Hello, ${user.displayName} </h1></div> </div>`)
              hide();
            })
            .catch((error) => {
              alrtLogin.classList.remove('hidden');
              alrtLogin.innerText = error.message;
            });
}

function register(){
      email = document.getElementById("register_email_field").value;
      password = document.getElementById("register_password_field").value;
      password2 = document.getElementById("register_password_field_2").value;
    
      if(password===password2){
          auth.createUserWithEmailAndPassword( email, password)
            .then((userCredential) => {
                let user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: document.getElementById("register_username_field").value
                })

              successReg.classList.remove('hidden');
              successReg.innerText = "Account created! You can now log in.";
              
              alrtReg.classList.add('hidden');
              // console.log(userCredential.user)
              accBack();
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