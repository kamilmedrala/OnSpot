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
      
    
      if (noteCrtIcon.getAttribute('data-js-opened')==1) {
        noteCrtIcon.setAttribute('data-js-opened', '0')  
      }
      else{
        noteCrtIcon.setAttribute('data-js-opened', '1')  
        noteCrtTxtTitle.value="";
        noteCrtTxtDesc.value="";
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
        const user = firebase.auth().currentUser;
        db.ref('users/' + user.uid + '/notes').get().then((snapshot) =>{
            NoteElements=snapshot.val();
            for (let i = 1; i < NoteElements.length; i++) {
                noteCrtContainer.insertAdjacentHTML('afterend',`<h1 data-j="${i}">${NoteElements[i].Title}</h1>`)      
            }
        })
        const notesCountRef = db.ref('users/' + user.uid + '/noteCount');            
            notesCountRef.get().then((snapshot) => {
                noteCounter = snapshot.val();
                if (noteCounter==null) {
                    noteCounter=0;
                }
            })
            
            noteSaveIcon.addEventListener('click',function () {
                    addNoteDb(user,noteCounter+1);      
            })
        } 
    });
    function addNoteDb(user,value) {
        console.log('adding');
      db.ref('users/' + user.uid ).update({
          noteCount: value,
        });
        db.ref('users/' + user.uid +'/notes/' + value ).set({
          Title: noteCrtTxtTitle.value,
          Content: noteCrtTxtDesc.value,
        });
        noteCounter++;
      
      }
    })
