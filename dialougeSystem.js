let dialouge = [{dialouge: "Hello!", emotion: "happy", type: "text" },{dialouge: "Sad Hello", emotion: "sad", type: "text" }, {dialouge: "You see a trash can, sitting innocently in the corner, potentially hiding the secrets of the universe within its maw. It almost seems to taunt you.", type: "internal-text"}, {dialouge: "Check inside the trash can?", type: "choice", choices: ["HELL YEAH", "No, wtf are you on about??"], results: [{text: "You check the trash can and find a mysterious key inside!", choice: "checkedTrashCan", value: 1 }, {text: "You didnt check the trash can...Good job", choice: "checkedTrashCan", value: 0 }]}];

let choices = [];
let storedChoices = localStorage.getItem('choices');
if (storedChoices) {
    choices = JSON.parse(storedChoices);
    console.log("Loaded choices from localStorage:", choices);
}
//check if the user checked the trash can
let checkedTrashCanChoice = choices.find(choice => choice.choice === "checkedTrashCan");
if (checkedTrashCanChoice) {
    if (checkedTrashCanChoice.value === 1) {
        dialouge = [{dialouge: "Hello!", emotion: "happy", type: "text" }, {dialouge: "You checked the trash can, didn't you?", emotion: "happy", type: "text" },{dialouge: "Wow...you are weird, you know that?", emotion: "happy", type: "text" }];
    } 
} 



const controller = new AbortController();

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
    let choicesDiv = document.getElementById("choices")
    let textbox = document.getElementById("dialouge-text")
    let i = 0;
    let speed = 30;
    choicesDiv.innerHTML = ""; // Clear previous choices
    //Clear any previous text
    textbox.innerHTML = "";
   //Handle choices
    if (text[0].type === "choice") {
        //stop registering the enter key until a choice is made
        controller.abort();
        text[0].choices.forEach(choice => {
            let button = document.createElement("button");
            button.innerText = choice;
            button.onclick = function() {
                console.log("You chose: " + choice);
                console.log("Choice index: " + this.value);
                choicesDiv.innerHTML = ""
                //Update the dialouge based on the choice given
                if (this.value == 0) {
                    dialouge[0].dialouge = text[0].results[0].text;
                    dialouge[0].type = "text"; // Change the type to text to prevent the choices from showing again
                    //push new object into choices array with the choice and value
                    choices.push({choice: text[0].results[0].choice, value: text[0].results[0].value});
                    localStorage.setItem('choices', JSON.stringify(choices)); // Store the choices array in localStorage
                } else if (this.value == 1) {
                    dialouge[0].dialouge = text[0].results[1].text;
                    dialouge[0].type = "text"; // Change the type to text to prevent the choices from showing again
                    choices.push({choice: text[0].results[1].choice, value: text[0].results[1].value});
                    localStorage.setItem('choices', JSON.stringify(choices)); // Store the choices array in localStorage
                }
                typeWriter(dialouge); // Call the typeWriter function again to display the new dialouge

            };
            button.value = text[0].choices.indexOf(choice);
            choicesDiv.appendChild(button);
        });
    }
    //type out the dialouge property of the first object in the dialouge array
    let typeInterval = setInterval(() => {
        if (i < text[0].dialouge.length) {
            textbox.innerHTML += text[0].dialouge.charAt(i);
            i++;
            if (text[0].type === "internal-text") {
                console.log("Internal text: " + text[0].dialouge);
                document.getElementById("character-image").src="Assets/Dialouge/Empty.png";
            }
            else if (i === 1) {
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
    }, {signal: controller.signal});

//Update the choice variable when button is pressed, then change the dialouge array based on the choice






window.onload = function() {
    typeWriter(dialouge);
   
}


  