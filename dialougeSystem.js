let dialouge = [{dialouge: "Hello!", emotion: "happy" },{dialouge: "Sad Hello", emotion: "sad" }]


const state = {
    _isActive: false,
    set isActive(value) {
      if (value === true) {
        changeImage();
        setTimeout(() => {
            changeImageBack();
            this._isActive = false; // Reset the boolean after the action is done
        }, 300); // Change image back 
      }
    },
    get isActive() { return this._isActive; }
  };


function changeImage() {
    let type = dialouge[0].emotion;
    if (type === "happy") {
    document.getElementById("character-image").src="Assets/Dialouge/CharacterPortraitHO.png";
    console.log("Image changed");
    } else if (type === "sad") {
        document.getElementById("character-image").src="Assets/Dialouge/CharacterPortraitSO.png";
        console.log("Image changed");
    }
    
}
function changeImageBack() {
    let type = dialouge[0].emotion;
    if (type === "happy") {
        document.getElementById("character-image").src="Assets/Dialouge/CharacterPortraitH.png";
        console.log("Image changed");
    }
    else if (type === "sad") {
        document.getElementById("character-image").src="Assets/Dialouge/CharacterPortraitS.png";
        console.log("Image changed");
    }
}

function typeWriter(text) {
    
    let textbox = document.getElementById("dialouge-text")
    let i = 0;
    let speed = 30;

    //Clear any previous text
    textbox.innerHTML = "";
    //type out the dialouge property of the first object in the dialouge array
    let typeInterval = setInterval(() => {
        if (i < text[0].dialouge.length) {
            textbox.innerHTML += text[0].dialouge.charAt(i);
            i++;
            if (i === 1) {
                state.isActive = true; // Set the boolean to true to trigger the image change
            }
        } else {
            clearInterval(typeInterval);
        }
    }, speed);
}


//wait for enter key, then call the typeWriter function with the dialouge array as an argument
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        dialouge.shift(); // Remove the first element of the dialouge array after it's displayed
        typeWriter(dialouge);
    }
});


window.onload = function() {
    typeWriter(dialouge);
   
}


  