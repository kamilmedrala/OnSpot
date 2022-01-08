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
    const showOne = document.getElementById('option_showOne');
    const mapAnim = document.getElementById('option_mapAnim');
    const onCreateOpen = document.getElementById('option_onCreateOpen')
    
    
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
    var NoteElements;
    app.auth().onAuthStateChanged((logged) => {
        if (logged) {
        clearNotes();
        const user = firebase.auth().currentUser;
        updateNoteDisplay(user);    
          noteSaveIcon.addEventListener('click',function () {   
              addNoteDb(user,noteCounter + 1);
          })
        } 
    });





    function updateNoteDisplay(user) {
      db.ref('users/' + user.uid + '/notes').get().then((snapshot) =>{
          NoteElements=0;
          NoteElements=snapshot.val();
          if(NoteElements!='null' && NoteElements!=null){
            NoteElements = Object.values(NoteElements);
            console.log(NoteElements);
            console.log(NoteElements.length);

            console.log(NoteElements.length);
            console.log('wchodzimy');
            for (let i = 0; i < NoteElements.length; i++) {
              if (NoteElements[i]!= null) {
                console.log('weszlo do ' + i);
                let NoteContent = NoteElements[i].Content;
                if (NoteContent=='') {
                  NoteContent = "No description";
                }
                let NoteTitle = NoteElements[i].Title;
                if (NoteTitle=='') {
                  NoteTitle = "No title";
                }
                noteCrtContainer.insertAdjacentHTML('afterend',`<div class="note" data-js-opened="0" data-js="${NoteElements[i].ID}" data-js-location="${NoteElements[i].Location}" ><h3 class="text-black pr-8 ">${NoteTitle}</h3> <i class="delete hover:text-yellow-300 transition absolute material-icons right-5 text-black text-xl top-1">delete</i> <span class="block text-black text-sm py-1.5 mt-2 border-x-0 border-y border-black dark:border-white border-opacity-10 dark:border-opacity-10 border-solid"> ${NoteElements[i].Location} </span> <p class="text-black pt-2"> ${NoteContent}</p></div>`)      
                Tag(NoteElements[i].Location,NoteElements[i].Title,NoteElements[i].ID)
              }
            }
          }
          let Notes = document.getElementsByClassName('note');
          for(let i = 0; i< Notes.length;i++){
            Notes[i].addEventListener('click',function () {
              if(this.getAttribute('data-js-opened')=='0'){
                if (showOne.checked){
                  for (let j = 0; j < Notes.length; j++) {
                    // Notes[j].style.maxHeight='40px';
                    Notes[j].setAttribute('data-js-opened','0');
                  }
                }
                // this.style.maxHeight='300px';
                Fly(this.getAttribute('data-js-location'))
                this.setAttribute('data-js-opened','1');
              }
              else{
                // this.style.maxHeight='40px';
                this.setAttribute('data-js-opened','0');
              }
            })

            //DELETING NOTE

            Notes[i].querySelector('.delete').addEventListener('click', function () {
              Notes[i].style.maxHeight='40px'; 
              setTimeout(function () {                
                Notes[i].style.transform = 'translateX(-100%)';
                Notes[i].style.opacity = '0';

            
              },200)
              setTimeout(function () {
                console.log('zaro usuna notatka nr:' + Notes[i].getAttribute('data-js'));
                removeNoteDb(user,Notes[i].getAttribute('data-js'));
                Notes[i].style.display='none';
              },500)
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
        
        ID: value,
        Title: noteCrtTxtTitle.value,
        Location: noteCrtTxtLocation.value,
        Content: noteCrtTxtDesc.value,
      });
      noteCounter++;
      updateNoteDisplay(user);
    
    }

    function removeNoteDb(user,id) {
      console.log('removing');
      db.ref('users/' + user.uid + '/notes/' + id).remove().then(function () {
        console.log('Succesfully removed');
      });  
    }


    // MAP
    var offset;

    if (window.innerWidth> 1024) {
      offset = 0.4;
    }
    else{
      offset = 0;
    }
    
    window.onresize = function () {
      if (window.innerWidth> 1024) {
        offset = 0.4;
      }
      else{
        offset = 0;
      }
    }


    var yellowIcon = L.icon({
      iconUrl: 'resources/img/location-pin.png',
  
      iconSize:     [40, 40], // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [20, 40], // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
       popupAnchor:  [0, -35] // point from which the popup should open relative to the iconAnchor
    });

    var dotIcon = L.icon({
      iconUrl: 'resources/img/location-here.png',
  
      iconSize:     [40, 40], // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [20, 25], // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
       popupAnchor:  [0, -35] // point from which the popup should open relative to the iconAnchor
    });

    const searchbarBtn = document.getElementById('searchbarBtn')

    searchbarBtn.addEventListener('click',function () {
      var where = document.getElementById('searchbar').value;
      if (where) {
        Fly(where);
      }
      
    })

    navigator.geolocation.getCurrentPosition(GeoSuccess,GeoError);


    const map = L.map('map',{zoomControl: false}).setView([0,0],2);
    map.options.minZoom = 2;
    map.setMaxBounds(  [[-90,-Infinity],   [90,Infinity]]  );
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);
    const Tiles = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=Vp06Pe6Ut4DX53ApAkJI',{
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(map);


//MAP TILES TEST



    document.getElementById('mapSat').addEventListener('click',function () {
      Tiles.setUrl('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=Vp06Pe6Ut4DX53ApAkJI')
      document.querySelector('html').classList.remove('dark');        
    })

    document.getElementById('mapDef').addEventListener('click',function () {
      Tiles.setUrl('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=Vp06Pe6Ut4DX53ApAkJI')
      document.querySelector('html').classList.remove('dark');
    })

    document.getElementById('mapDark').addEventListener('click',function () {
      Tiles.setUrl('https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/{z}/{x}/{y}.png?key=Vp06Pe6Ut4DX53ApAkJI')
      document.querySelector('html').classList.add('dark');
    })

    var baseCoords;
    function GeoSuccess(position) {
      console.log(position.coords);
      baseCoords = [position.coords.latitude,position.coords.longitude]
      map.flyTo([baseCoords[0],baseCoords[1] - offset*4],8, {
        "animate": (mapAnim.checked) ? true:false,
        "duration": 1
      });

      document.getElementById('locationBtn').addEventListener('click',function () {
        map.flyTo([baseCoords[0],baseCoords[1] - offset*0.01],17, {
          "animate": (mapAnim.checked) ? true:false,
          "duration": 1
        });
        marker = L.marker([baseCoords[0],baseCoords[1]], {icon: dotIcon}).addTo(map)
        marker.bindPopup(`<b class="text-center"> You are somewhere here. </b>`)
        marker._icon.classList.add('animate-pulse');

      })

    }
    function GeoError(error) {
      console.log(error);
    }


    function Tag(address,msg,id) {
    if(address!=undefined && address!=''){
      var coordinates;
    fetch(` //nominatim.openstreetmap.org/search?format=json&q=${address} `)
    .then(function(response) {
      return response.json();
    }).then(function (responseJson) {
      coordinates=[responseJson[0].lat,responseJson[0].lon];
      let noteMarker = L.marker([coordinates[0],coordinates[1]], {icon: yellowIcon}).addTo(map)
      noteMarker.bindPopup(`<b>${msg}<br />`)
      if (id!= undefined) {
        noteMarker.on('click',function () {
          if (showOne.checked) {
            let Notes = document.getElementsByClassName('note');
            for (let j = 0; j < Notes.length; j++) {
              Notes[j].setAttribute('data-js-opened','0');
            }
          }
          document.querySelector(`[data-js="${id}"]`).setAttribute('data-js-opened','1');
          swiper.slidePrev();
        })
      }
    })  
    }  
  }

  function Fly(address) {
    if(address!=undefined && address!=''){
      var coordinates;
    fetch(` //nominatim.openstreetmap.org/search?format=json&q=${address} `)
    .then(function(response) {
      return response.json();
    }).then(function (responseJson) {
      coordinates=[responseJson[0].lat,responseJson[0].lon];
      map.flyTo([coordinates[0],coordinates[1] - offset*0.5],11, {
        "animate": (mapAnim.checked) ? true:false,
        "duration": 2
      });
    })  
    }  
  }

  
  var marker=0;
  map.on('click',function (e) {
      if(noteCrtContainer.getAttribute('data-js-opened')==0){
      console.log(e.latlng);
      map.flyTo([e.latlng.lat,e.latlng.lng - offset],10, {
        "animate": (mapAnim.checked) ? true:false,
        "duration": 2
      });
      marker = L.marker([e.latlng.lat,e.latlng.lng], {icon: yellowIcon}).addTo(map)

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

        swiper.slidePrev();

        marker.bindPopup(`<b class="text-center"> Open notes panel to create <br> a new note or cancel </b>`).openPopup();
        if (onCreateOpen.checked) {
          map.once('zoomend', function () {
            document.getElementById("user_nav").classList.add("active");
            document.getElementById("user_nav").classList.remove("rounded-3xl");
            document.getElementById("user_nav").classList.add("rounded-t-3xl");
            document.getElementById("user_panel_container").classList.replace("h-0", "h-full");
            document.getElementById("user_panel").classList.remove("-translate-y-full");
            panelState=true;
          
            if (panelState && window.innerWidth < 1024) {
              document.getElementById("map").classList.add("brightness-50");
            }

          })
        }
      }
    })




})

