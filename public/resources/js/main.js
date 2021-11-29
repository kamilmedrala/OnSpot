document.addEventListener('DOMContentLoaded',function () {

  const userPanel = document.getElementById("user_panel");
  const userPanelBtn = document.getElementById("user_panel_btn");
  const userPanelContainer = document.getElementById("user_panel_container");
  var panelState = true;


  const navContainer = document.getElementById("user_nav");
  const navBlank = document.getElementById("nav_blank");

  const navUser = document.getElementById("user_btn");
  const navNotes = document.getElementById("note_btn");

  const mapContainer = document.getElementById("map_container");

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
    userPanelBtn.addEventListener("touchmove", move);
  });


  function move(e) {
    clientY = e.touches[0].clientY - window.innerHeight + 52;
    if(clientY<=0){
    userPanel.style.setProperty("transform", "translateY(" + clientY + "px)");
    }
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
  });





  //adding Notes styles

  const noteCrtContainer = document.getElementById("note_container");
  const noteCrtHeader = document.getElementById("btn_note-create-text");
  const noteCrtBtn = document.getElementById("btn_note-create");
  const noteCrtIcon = document.getElementById("btn_note-create-icon");
  const noteCrtTxt = document.getElementById("text_note");
  const noteCrtTxtTitle = document.getElementById("note_content-title");
  const noteCrtTxtDesc = document.getElementById("note_content-text");



  noteCrtBtn.addEventListener('click',function () {
    noteCrtContainer.classList.toggle('bg-white');
    noteCrtContainer.classList.toggle('hover:bg-opacity-100');    
    noteCrtContainer.classList.toggle('shadow-lg');
    noteCrtHeader.classList.toggle('opacity-0');
    noteCrtHeader.classList.toggle('z-40');
    noteCrtIcon.classList.toggle('text-black');
    noteCrtIcon.classList.toggle('-rotate-45');
    noteCrtTxt.classList.toggle('hidden');
    noteCrtTxt.classList.toggle('opacity-100')

    if (noteCrtTxtTitle.value) {
      noteCrtHeader.innerText = noteCrtTxtTitle.value;
      noteCrtIcon.innerText = 'edit';
    }
    else{
      noteCrtHeader.innerText = 'Add new note'
      noteCrtIcon.innerText = 'add';
    }
  })

  noteCrtTxtDesc.addEventListener('input', function () {
    this.style.height = "";
    this.style.height = this.scrollHeight + "px";
  })
  
});