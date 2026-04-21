let dialouge = [{ dialouge: "Hello!", emotion: "happy", type: "text", person: "Sadie" }, { dialouge: "Sad Hello", emotion: "sad", type: "text", person: "Sadie" }, { dialouge: "You see a trash can, sitting innocently in the corner, potentially hiding the secrets of the universe within its maw. It almost seems to taunt you.", type: "internal-text" }, { dialouge: "Check inside the trash can?", type: "choice", choices: ["HELL YEAH", "No, wtf are you on about??"], results: [{ text: "You give into your urges; the <b>animalistic</b> desire to know what <em>exactly</em> was in that trash can...only to find nothing.", choice: "checkedTrashCan", value: 1 }, { text: "You didnt check the trash can...Good job", choice: "checkedTrashCan", value: 0 }] }];


import "https://unpkg.com/typewriter-effect@latest/dist/core.js"; 
//Usage:
// Dialouge: What the character says....pretty simple
// Emotion: Changes the emotion of the character portrait
// type: "text" - normal dialouge, just text, "internal-text" - text that is meant to be internal monologue, so the character portrait will disappear, "choice" - gives the player a choice to make, and the results of that choice will change the dialouge based on what they choose
// choices: an array of choices for the player to choose from, only used if type is "choice"
// results: an array of results for each choice, only used if type is "choice", each result should have a text property that changes the dialouge, a choice property that is used to store the choice made in the choices array, and a value property that is used to store the value of the choice made in the choices array (for example, if the player checks the trash can, the value could be 1, if they dont check it, the value could be 0)

let enterKeyListener = true
let choices = [];
let storedChoices = localStorage.getItem('choices');
if (storedChoices) {
    choices = JSON.parse(storedChoices);
    console.log("Loaded choices from localStorage:", choices);

}   

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
    let emotion = dialouge[0].emotion;
    let type = dialouge[0].type;
    if (type === "internal-text") {
        document.getElementById("character-image").style = "display: none;";
        console.log("Image changed");
    }
    else if (type === "text") {
        if (emotion === "happy") {
            document.getElementById("character-image").src = "Assets/Dialouge/CharacterPortraitHO.png";
            document.getElementById("character-image").style = "display: block;";
            console.log("Image changed");
        } else if (emotion === "sad") {
            document.getElementById("character-image").src = "Assets/Dialouge/CharacterPortraitSO.png";
            document.getElementById("character-image").style = "display: block;";
            console.log("Image changed");
        }
    }
    else if (type === "choice") {
        document.getElementById("character-image").src = "Assets/Dialouge/MCThink.png";
        document.getElementById("character-image").style = "display: block;";
        document.documentElement.style.setProperty('--portrait-position', '32%');
        console.log("Image changed");
        
    }

   

}
function changeImageBack() {
    let type = dialouge[0].emotion;
    if (type === "happy") {
        document.getElementById("character-image").src = "Assets/Dialouge/CharacterPortraitH.png";
        console.log("Image changed");
    }
    else if (type === "sad") {
        document.getElementById("character-image").src = "Assets/Dialouge/CharacterPortraitS.png";
        console.log("Image changed");
    }
}

function typeWriter(text) { 
    let choicesDiv = document.getElementById("choices")
    let textbox = document.getElementById("dialouge-text")
    let characterName = document.getElementById("dialouge-name")
    let dialougeBox = document.getElementById("dialouge-box")
    choicesDiv.innerHTML = ""; // Clear previous choices
    //Clear any previous text
    textbox.innerHTML = "";
    //Handle choices
    if (text[0].type === "choice") {
        //stop registering the enter key until a choice is made
        enterKeyListener = false;
        document.documentElement.style.setProperty('--gradient', 'rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)');
        dialougeBox.src = "Assets/Dialouge/thinkingcloud.png";
        textbox.style = "text-align: center;"
        text[0].choices.forEach(choice => {
            let button = document.createElement("button");
            button.innerText = choice;
            button.onclick = function () {
                console.log("You chose: " + choice);
                console.log("Choice index: " + this.value);
                choicesDiv.innerHTML = ""
                textbox.style = "text-align: left;"
                document.documentElement.style.setProperty('--gradient', 'rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)');
                dialougeBox.src = "Assets/Dialouge/DialougeboxN.gif";
                document.documentElement.style.setProperty('--portrait-position', '14%');
                //Update the dialouge based on the choice given
                if (this.value == 0) {
                    dialouge[0].dialouge = text[0].results[0].text;
                    dialouge[0].type = "text"; // Change the type to text to prevent the choices from showing again
                    //push new object into choices array with the choice and value
                    choices.push({ choice: text[0].results[0].choice, value: text[0].results[0].value });
                    localStorage.setItem('choices', JSON.stringify(choices));
                     // Store the choices array in localStorage
                    dialouge = dialouge.concat([{ dialouge: "Hello!", emotion: "happy", type: "text", person:"Sadie" }, { dialouge: "You checked the trash can, didn't you?", emotion: "happy", type: "text", person: "Sadie" }, { dialouge: "Wow...you are weird, you know that?", emotion: "happy", type: "text", person: "Sadie"}, {event: "fight"}]);
                    enterKeyListener = true; // Re-enable the enter key listener after the choice is made
                }
             else if (this.value == 1) {
                dialouge[0].dialouge = text[0].results[1].text;
                dialouge[0].type = "text"; // Change the type to text to prevent the choices from showing again
                choices.push({ choice: text[0].results[1].choice, value: text[0].results[1].value });
                localStorage.setItem('choices', JSON.stringify(choices)); // Store the choices array in localStorage

            }
            typeWriter(dialouge); // Call the typeWriter function again to display the new dialouge

        };
        button.value = text[0].choices.indexOf(choice);
        choicesDiv.appendChild(button);
    });
}
else if (text[0].event === "fight") {
    window.location.href = 'fight.html'
}
//type out the dialouge property of the first object in the dialouge array
const typewriter = new Typewriter(document.getElementById('dialouge-text'), {
    loop: false,
    delay: 30,
  });

  typewriter
  .typeString(text[0].dialouge)
  .start();

  state.isActive = true; // Trigger the image change when the typewriter starts
  characterName.innerText = text[0].person ? text[0].person : ""; // Set the character name if it exists, otherwise set it to an empty string
}



//wait for enter key, then call the typeWriter function with the dialouge array as an argument

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        if (enterKeyListener) {
            dialouge.shift(); // Remove the first element of the dialouge array after it's displayed
            typeWriter(dialouge);
        }
    }
});

//Update the choice variable when button is pressed, then change the dialouge array based on the choice






window.onload = function () {
    typeWriter(dialouge);

}


