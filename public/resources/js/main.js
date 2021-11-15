const userPanel = document.getElementById("user_panel");
const userPanelBtn = document.getElementById("user_panel_btn");
const userPanelContainer = document.getElementById("user_panel_container");
var panelState = true;

const userNav = document.getElementById("user_nav");

const mapContainer = document.getElementById("map_container");

function Hide() {
  userNav.classList.add("rounded-3xl");
  userNav.classList.remove("rounded-t-3xl");
  userPanelContainer.classList.replace("h-0", "h-full");
  userPanel.classList.add("-translate-y-full");
  panelState=false;

  if (!panelState && window.innerWidth < 1024) {
    mapContainer.classList.remove("brightness-50");
  }
}

function Show() {
  userNav.classList.remove("rounded-3xl");
  userNav.classList.add("rounded-t-3xl");
  userPanelContainer.classList.replace("h-0", "h-full");
  userPanel.classList.remove("-translate-y-full");
  panelState=true;

  if (panelState && window.innerWidth < 1024) {
    mapContainer.classList.add("brightness-50");
  }
}

userNav.addEventListener("click", Show);
userPanelBtn.addEventListener("click", Hide);

var clientY;

userPanelBtn.addEventListener("touchstart", function () {
  userPanel.classList.remove("duration-300");
  userPanelBtn.addEventListener("touchmove", move);
});


function move(e) {
  clientY = e.touches[0].clientY - window.innerHeight + 52;
  userPanel.style.setProperty("transform", "translateY(" + clientY + "px)");
  console.log(clientY);
  
}


userPanelBtn.addEventListener("touchend", function () {
  userPanel.style.removeProperty('transform');
  userPanel.classList.add("duration-300");

  if (clientY < -(window.innerHeight/3)) {
    clientY=0;
    userPanelBtn.removeEventListener("touchmove",move);
    userPanel.style.removeProperty('transform');
    userPanel.classList.add("duration-300");
    Hide();
  }
  else{
    Show();

  }
});



// User account section

const accBox = document.getElementById("user_panel-account-container");
const loginBox = document.getElementById("user_panel-account-login");
const registerBox = document.getElementById("user_panel-account-register");



function fadeRegister() {
  console.log("koniec");
  accBox.prepend(registerBox);
  accBox.classList.remove('opacity-0','lg:-translate-x-2');
  accBox.removeEventListener('transitionend', fadeRegister)
}

function openRegister() {
  accBox.classList.add('opacity-0','lg:-translate-x-2')
  accBox.addEventListener('transitionend', fadeRegister)

}

function fadeBck() {
  console.log("koniec");
  accBox.prepend(loginBox);
  accBox.classList.remove('opacity-0','lg:-translate-x-2');
  accBox.removeEventListener('transitionend', fadeBck)
}

function accBack() {
  accBox.classList.add('opacity-0','lg:-translate-x-2')
  accBox.addEventListener('transitionend', fadeBck)
}

function hide() {
  accBox.classList.add('hidden');
}




// userPanel.addEventListener("transitionend", function () {
//   if (userPanel.classList.contains("-translate-y-full") == true) {
//     userPanelContainer.classList.replace("h-full", "h-0");
//   }
// });
