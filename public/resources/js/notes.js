//adding Notes styles and db functionality
// const db = firebase.database();


document.addEventListener('DOMContentLoaded', function () {
    
    const noteCrtContainer = document.getElementById("note_container");
    const noteCrtHeader = document.getElementById("btn_note-create-text");
    const noteCrtBtn = document.getElementById("btn_note-create");
    const noteCrtIcon = document.getElementById("btn_note-create-icon");
    const noteSaveIcon = document.getElementById("btn_note-save-icon");
    const noteCrtTxt = document.getElementById("text_note");
    const noteCrtTxtTitle = document.getElementById("note_content-title");
    const noteCrtTxtLocation = document.getElementById("note_content-location");
    const noteCrtTxtDesc = document.getElementById("note_content-text");
    
    
    noteCrtBtn.addEventListener('click',function () {
      noteCrtContainer.classList.toggle('bg-white');
      noteCrtContainer.classList.toggle('hover:bg-opacity-100');    
      noteCrtContainer.classList.toggle('shadow-lg');
      noteCrtHeader.classList.toggle('opacity-0');
      noteCrtHeader.classList.toggle('z-40');
      noteSaveIcon.classList.toggle('opacity-0');
      noteSaveIcon.classList.toggle('pointer-events-none');
      noteCrtIcon.classList.toggle('text-black');
      noteCrtIcon.classList.toggle('-rotate-45');
      noteCrtTxt.classList.toggle('hidden');
      noteCrtTxt.classList.toggle('opacity-100');
      
    
      if (noteCrtContainer.getAttribute('data-js-opened')==1) {
        noteCrtContainer.setAttribute('data-js-opened', '0')  
      }
      else{
        noteCrtContainer.setAttribute('data-js-opened', '1')  
        noteCrtTxtTitle.value="";
        noteCrtTxtDesc.value="";
      }
      if (marker!=0) {
        map.removeLayer(marker);
      }
    
    })
    
    noteCrtTxtDesc.addEventListener('input', function () {
      this.style.height = "";
      this.style.height = this.scrollHeight + "px";
    })

    



    
    var noteCounter=0;
    var NoteElements='';
    app.auth().onAuthStateChanged((logged) => {
        if (logged) {
        clearNotes();
        const user = firebase.auth().currentUser;
        updateNoteDisplay(user);    
          noteSaveIcon.addEventListener('click',function () {   
              addNoteDb(user,noteCounter+1);
          })
        } 
    });





    function updateNoteDisplay(user) {
      db.ref('users/' + user.uid + '/notes').get().then((snapshot) =>{
          NoteElements=snapshot.val();
          if(NoteElements!=null){
            for (let i = 1; i < NoteElements.length; i++) {
              let NoteContent = NoteElements[i].Content;
              if (NoteContent=='') {
                NoteContent = "Brak opisu";
              }
                noteCrtContainer.insertAdjacentHTML('afterend',`<div class="note" data-js-opened="0" data-js="${i}" data-js-location="${NoteElements[i].Location}" style="max-height:40px;"><h3 class="text-black pr-8 ">${NoteElements[i].Title}</h3><p class="text-black"></br> ${NoteContent}</p></div>`)      
                Tag(NoteElements[i].Location,NoteElements[i].Title)
            }
          }
          let Notes = document.getElementsByClassName('note');
          for(let i = 0; i< Notes.length;i++){
            Notes[i].addEventListener('click',function () {
              if(this.getAttribute('data-js-opened')=='0'){
                for (let j = 0; j < Notes.length; j++) {
                  Notes[j].style.maxHeight='40px';
                  Notes[j].setAttribute('data-js-opened','0');
                }
                this.style.maxHeight='300px';
                Fly(this.getAttribute('data-js-location'))
                this.setAttribute('data-js-opened','1');
              }
              else{
                this.style.maxHeight='40px';
                this.setAttribute('data-js-opened','0');
              }
            })
          }
      })

      const notesCountRef = db.ref('users/' + user.uid + '/noteCount');            
          notesCountRef.get().then((snapshot) => {
              noteCounter = snapshot.val();
              if (noteCounter==null) {
                  noteCounter=0;
              }
          })
    }
    
    function clearNotes() {      
      let notesTemp = document.getElementsByClassName('note')
      if(notesTemp.length>0){
        let tempLength = notesTemp.length;
        for (let i = tempLength-1; i >= 0; i--) {
          notesTemp[i].remove();
        }
      }  
    }
    
    function addNoteDb(user,value) {
    clearNotes();
    console.log('adding');
    db.ref('users/' + user.uid ).update({
        noteCount: value,
      });
      db.ref('users/' + user.uid +'/notes/' + value ).set({
        Title: noteCrtTxtTitle.value,
        Location: noteCrtTxtLocation.value,
        Content: noteCrtTxtDesc.value,
      });
      noteCounter++;
      updateNoteDisplay(user);
    
    }


    // MAP

    const searchbarBtn = document.getElementById('searchbarBtn')

    searchbarBtn.addEventListener('click',function () {
      var where = document.getElementById('searchbar').value;
      if (where) {
        Search(where);
      }
      
    })

    const map = L.map('map',{zoomControl: false}).setView([0,0],2);
    map.options.minZoom = 2;
    map.setMaxBounds(  [[-90,-Infinity],   [90,Infinity]]  );
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=Vp06Pe6Ut4DX53ApAkJI',{
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(map);


    function Tag(address,msg) {
    if(address!=undefined){
      var coordinates;
    fetch(` //nominatim.openstreetmap.org/search?format=json&q=${address} `)
    .then(function(response) {
      return response.json();
    }).then(function (responseJson) {
      coordinates=[responseJson[0].lat,responseJson[0].lon];
      let noteMarker = L.marker([coordinates[0],coordinates[1]]).addTo(map)
      noteMarker.bindPopup(`<b>${msg}<br />`)
    })  
    }  
  }

  function Fly(address) {
    if(address!='undefined'){
      var coordinates;
    fetch(` //nominatim.openstreetmap.org/search?format=json&q=${address} `)
    .then(function(response) {
      return response.json();
    }).then(function (responseJson) {
      coordinates=[responseJson[0].lat,responseJson[0].lon];
      map.flyTo([coordinates[0],coordinates[1]-0.4],10, {
        "animate": true,
        "duration": 2
      });
    })  
    }  
  }

  var marker=0;
  map.on('click',function (e) {
    console.log(e.latlng);
    map.flyTo([e.latlng.lat,e.latlng.lng-0.4],10, {
      "animate": true,
      "duration": 2
    });
    marker = L.marker([e.latlng.lat,e.latlng.lng]).addTo(map)

    noteCrtContainer.classList.toggle('bg-white');
      noteCrtContainer.classList.toggle('hover:bg-opacity-100');    
      noteCrtContainer.classList.toggle('shadow-lg');
      noteCrtHeader.classList.toggle('opacity-0');
      noteCrtHeader.classList.toggle('z-40');
      noteSaveIcon.classList.toggle('opacity-0');
      noteSaveIcon.classList.toggle('pointer-events-none');
      noteCrtIcon.classList.toggle('text-black');
      noteCrtIcon.classList.toggle('-rotate-45');
      noteCrtTxt.classList.toggle('hidden');
      noteCrtTxt.classList.toggle('opacity-100');
      
    
      if (noteCrtContainer.getAttribute('data-js-opened')==0) {
        noteCrtContainer.setAttribute('data-js-opened', '1')  
        noteCrtTxtTitle.value="";
        noteCrtTxtLocation.value=`${e.latlng.lat} , ${e.latlng.lng}`;
        noteCrtTxtDesc.value="";
      }

    
  })




})

