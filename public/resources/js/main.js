var panelState = true;
document.addEventListener('DOMContentLoaded',function () {

  const userPanel = document.getElementById("user_panel");
  const userPanelBtn = document.getElementById("user_panel_btn");
  const userPanelContainer = document.getElementById("user_panel_container");


  const navContainer = document.getElementById("user_nav");
  const navBlank = document.getElementById("nav_blank");

  const navUser = document.getElementById("user_btn");
  const navNotes = document.getElementById("note_btn");

  const mapContainer = document.getElementById("map");

  function Hide() {
    navContainer.classList.add("rounded-3xl");
    navContainer.classList.remove("rounded-t-3xl","active");
    userPanelContainer.classList.replace("h-0", "h-full");
    userPanel.classList.add("-translate-y-full");
    panelState=false;

    if (!panelState && window.innerWidth < 1024) {
      mapContainer.classList.remove("brightness-50");
    }



  }

  function Show() {
      navContainer.classList.add("active");
      navContainer.classList.remove("rounded-3xl");
      navContainer.classList.add("rounded-t-3xl");
      userPanelContainer.classList.replace("h-0", "h-full");
      userPanel.classList.remove("-translate-y-full");
      panelState=true;
    
      if (panelState && window.innerWidth < 1024) {
        mapContainer.classList.add("brightness-50");
      }
  }

  function Toggle() {
    if (panelState) {
      Hide();
    }
    else{
      Show();
    }
  }

  navBlank.addEventListener("click", Toggle);
  userPanelBtn.addEventListener("click", Hide);

  navUser.addEventListener('click',Show);
  navNotes.addEventListener('click',Show);

  var clientY;

  userPanelBtn.addEventListener("touchstart", function () {
    userPanel.classList.remove("duration-300");
    userPanel.classList.add("duration-[1ms]");
    userPanelBtn.addEventListener("touchmove", move);
  });


  function move(e) {
    clientY = e.touches[0].clientY - window.innerHeight + 52;
    clientY = Math.trunc(clientY);
    console.log(clientY);
    if(clientY<=0){
    userPanel.style.setProperty("transform", "translateY(" + clientY + "px)");
    }
  }


  userPanelBtn.addEventListener("touchend", function () {
    userPanel.style.removeProperty('transform');
    userPanel.classList.add("duration-300");
    userPanel.classList.remove("duration-[1ms]");

    if (clientY < -(window.innerHeight/3)) {
      clientY=0;
      Hide();
    }
  });

});