//adding Notes styles and db functionality
// const db = firebase.database();

var noteMarkerTables= [];
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
    
    var frombtn = undefined

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
        frombtn=true;
        map.removeLayer(marker); 
        frombtn=false
      }
    
    })
    
    noteCrtTxtDesc.addEventListener('input', function () {
      this.style.height = "";
      this.style.height = this.scrollHeight + "px";
    })

    



    
    var noteCounter=0;
    app.auth().onAuthStateChanged((logged) => {
        if (logged) {
        clearNotes();
        const user = firebase.auth().currentUser;
        updateNoteDisplay(user,false);    
          noteSaveIcon.addEventListener('click',function () {   
              addNoteDb(user,noteCounter + 1);
          })
          check(user);
        } 
        else{
          if (noteMarkerTables.length>0) {
            for(i in noteMarkerTables){
              map.removeLayer(noteMarkerTables[i])
            }
          }
          noteMarkerNumBfr = 0
        }
    });



    var once=0
    function check(user) {
      // var NoteElementsBefore=[]
      // var NoteElementsNew=[]
      // setInterval(() => {
      //   db.ref('users/' + user.uid + '/notes').get().then((snapshot) =>{  
      //     NoteElementsBefore=snapshot.val();
      //       if(NoteElementsBefore!='null' && NoteElementsBefore!=null){
      //         NoteElementsBefore = Object.values(NoteElementsBefore);
      //         // for (let j = 0; j < NoteElementsBefore.length; j++) {
      //           if (once>0) {
      //           if (NoteElementsNew.length != NoteElementsBefore.length ) {
      //             console.log('ZMIANY');
      //             clearNotes()
      //             for(i in noteMarkerTables){
      //               map.removeLayer(noteMarkerTables[i])
      //             }
      //             updateNoteDisplay(user,true)
      //           }
      //         }
      //         // }
      //         once=1;
      //         NoteElementsNew = NoteElementsBefore;
      //         console.log(NoteElementsNew);
      //       }
      //     })
      //   }, 3000);

    }



    
    function updateNoteDisplay(user,checkerState) {
      var checker = checkerState;
      var NoteElements;
      var noteMarkerNumBfr = noteMarkerTables.length;
      // if (checker) {
      //   noteMarkerNumBfr =0;
      // }
      console.log(noteMarkerNumBfr);
      db.ref('users/' + user.uid + '/notes').get().then((snapshot) =>{
          // noteMarkerTables= [];
          NoteElements=0;
          NoteElements=snapshot.val();
          if(NoteElements!='null' && NoteElements!=null){
            NoteElements = Object.values(NoteElements);
            // console.log(NoteElements);
            console.log(NoteElements.length);
            console.log('wchodzimy');
            for (let i = 0; i < NoteElements.length; i++) {
              if (NoteElements[i]!= null) {
                // console.log('weszlo do ' + i);
                let NoteContent = NoteElements[i].Content;
                if (NoteContent=='') {
                  NoteContent = "No description";
                }
                let NoteTitle = NoteElements[i].Title;
                if (NoteTitle=='') {
                  NoteTitle = "No title";
                }
                noteCrtContainer.insertAdjacentHTML('afterend',`<div class="note" data-js-opened="0" data-js="${NoteElements[i].ID}" data-js-location="${NoteElements[i].Location}" ><h3 class="text-black pr-8 ">${NoteTitle}</h3> <i class="delete hover:text-yellow-300 transition absolute material-icons right-5 text-black text-xl top-1">delete</i> <span class="block text-black text-sm py-1.5 mt-2 border-x-0 border-y border-black dark:border-white border-opacity-10 dark:border-opacity-10 border-solid"> ${NoteElements[i].Location} </span> <p class="text-black pt-2"> ${NoteContent}</p></div>`)      
              }
            }
            TagAll(noteMarkerNumBfr,NoteElements)
          }


          let Notes = document.getElementsByClassName('note');
          console.log(Notes);
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
                console.log('Usuwana notatka nr:' + Notes[i].getAttribute('data-js'));
                removeNoteDb(user,Notes[i].getAttribute('data-js'),i);
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

    // functions.dbf.ref('users/' + user.uid).onUpdate(function () {
    //   console.log(' DZIALOOOOOOOOO');
    // })
    
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
      updateNoteDisplay(user,false);
    //   dbf.collection("users").doc(user.uid).set({
    //     update: true
    //   }).then(() => {
    // console.log("dbf updated");})
    
    }

    function removeNoteDb(user,id,index) {
      console.log('removing');
      console.log(index);
      console.log(noteMarkerTables);
      console.log(noteMarkerTables[noteMarkerTables.length - (index+1)]);
      map.removeLayer(noteMarkerTables[noteMarkerTables.length - (index+1)]);
      noteMarkerTables.splice(noteMarkerTables.length - (index+1),1)
      db.ref('users/' + user.uid + '/notes/' + id).remove().then(function () {
        console.log('Succesfully removed');
        clearNotes();
        updateNoteDisplay(user,false)
      });  
    //   dbf.collection("users").doc(user.uid).set({
    //     update: true
    //   }).then(() => {
    // console.log("dbf updated");
    // })
      
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


    const map = L.map('map',{zoomControl: false, tap:false}).setView([0,0],2);
    map.options.minZoom = 2;
    map.setMaxBounds(  [[-90,-Infinity],   [90,Infinity]]  );
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);
    const Tiles = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=5AonFqHs3GZazDdOj4vU',{
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(map);


//MAP TILES TEST



    document.getElementById('mapSat').addEventListener('click',function () {
      Tiles.setUrl('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=5AonFqHs3GZazDdOj4vU')
      document.querySelector('html').classList.remove('dark');        
    })

    document.getElementById('mapDef').addEventListener('click',function () {
      Tiles.setUrl('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=5AonFqHs3GZazDdOj4vU')
      document.querySelector('html').classList.remove('dark');
    })

    document.getElementById('mapDark').addEventListener('click',function () {
      Tiles.setUrl('https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/{z}/{x}/{y}.png?key=5AonFqHs3GZazDdOj4vU')
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


    function next() {
      if (resolver) resolver.call();
      console.log('gro');
    }
    
    async function TagAll(noteMarkerNumBfr,NoteElements) {
      for (let i = 0; i < NoteElements.length; i++) {

        if (noteMarkerNumBfr <= i) {
          if(NoteElements[i].Location!=undefined && NoteElements[i].Location!=''){
            var coordinates;


              await fetch(` //nominatim.openstreetmap.org/search?format=json&q=${NoteElements[i].Location} `)
              .then(function(response) {
                return response.json();
              }).then(function (responseJson) {
                coordinates=[responseJson[0].lat,responseJson[0].lon];
                let noteMarker = L.marker([coordinates[0],coordinates[1]], {icon: yellowIcon}).addTo(map).openPopup()
                noteMarker.bindPopup(`<b>${NoteElements[i].Title}<br />`)
                if (NoteElements[i].ID!= undefined) {
                  noteMarker.on('click',function () {
                    if (showOne.checked) {
                      let Notes = document.getElementsByClassName('note');
                      for (let j = 0; j < Notes.length; j++) {
                        Notes[j].setAttribute('data-js-opened','0');
                      }
                    }
                    document.querySelector(`[data-js="${NoteElements[i].ID}"]`).setAttribute('data-js-opened','1');
                    swiper.slidePrev();
                  })
                }
                noteMarkerTables.push(noteMarker);
                console.log(i);
              })  

          }  
  
        }
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
        "duration": 1.2
      });
    })  
    }  
  }

  
  var marker=0;
  map.on('click',function (e) {
    if (marker) {        
      map.removeLayer(marker);
    }
    console.log(e.latlng);
    map.flyTo([e.latlng.lat,e.latlng.lng - offset],10, {
      "animate": (mapAnim.checked) ? true:false,
      "duration": 1.2
    });
    marker = L.marker([e.latlng.lat,e.latlng.lng], {icon: yellowIcon}).addTo(map)
    if(noteCrtContainer.getAttribute('data-js-opened')==0){
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
      noteCrtContainer.setAttribute('data-js-opened', '1')  
    }
    noteCrtTxtTitle.value="";
    noteCrtTxtLocation.value=`${e.latlng.lat} , ${e.latlng.lng}`;
    noteCrtTxtDesc.value="";
      

        swiper.slidePrev();

        marker.bindPopup(`<b class="text-center"> Open notes panel to create <br> a new note or cancel </b>`).openPopup();
        marker.getPopup().on('remove', function() {
              // if (frombtn) {
              //   frombtn=false
              // }
            map.removeLayer(marker);
            console.log(marker);
            if (!frombtn) {
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
      noteCrtContainer.setAttribute('data-js-opened', '0')
            }

      });

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
      
    })




})

