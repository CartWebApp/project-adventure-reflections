// let dialouge = [{ dialouge: "Hello!", emotion: "happy", type: "text", person: "Sadie", location: "club" }, { dialouge: "Sad Hello", emotion: "sad", type: "text", person: "Sadie", location: "room" }, { dialouge: "You see a trash can, sitting innocently in the corner, potentially hiding the secrets of the universe within its maw. It almost seems to taunt you.", type: "internal-text" }, { dialouge: "Check inside the trash can?", type: "choice", choices: ["HELL YEAH", "No, wtf are you on about??", "Third Test Choice"], results: [{ text: "You give into your urges; the <b>animalistic</b> desire to know what <em>exactly</em> was in that trash can...only to find nothing.", choice: "checkedTrashCan", value: 1 }, { text: "You didnt check the trash can...Good job", choice: "checkedTrashCan", value: 0 }] }];

let dialouge = [{dialouge: "<b>Ring ring ring!</b>", type: "internal-text", location: "room", box: "e"}, {dialouge: "The alarm clock reverbs through my ears as the sound reaches my nerves. I jolt off of my bed from the ringing and mess up my hair.", type: "internal-text", location: "room"}, { dialouge: "<em>“Ouch… that hurt…”</em>", type: "internal-text", location: "room"}, { dialouge: "I sit up calmly and stretch all my limbs before I get up.", type: "internal-text", location: "room"}, { dialouge: "“Yuma! Come downstairs and eat your breakfast before you leave!”", type: "text", location: "room", person: "Mom", emotion: "happy"}, {dialouge: "My mom’s voice echoes from downstairs and up into my room.", type: "internal-text", location: "room"}, { dialouge: "“Yeah, yeah, I’m coming.” I said.", type: "internal-text", location: "room"}, {dialouge: "I change into my school uniform before heading downstairs and look in the mirror.", type: "internal-text", location: "room"}, { dialouge: "", type: "choice", location: "room", choices: ["Look in the mirror and reflect before you go", "Step away calmly and go", "Turn away abruptly and go"], results: [{ text: "“This is me… right?”", choice: "mirror", value: "lookedIn" }, { text: "“I don’t want to be late. I should go.”", choice: "mirror", value: "steppedCalmly"},{ text: "““No need to look.”", choice: "mirror", value: "turnedAbruptly"} ]}, { dialouge: "I grab a steamy bun from the toaster and head out the door towards the train station.", type: "internal-text", location: "kitchen"}, { dialouge: "The train door opens with sounds rushing in of chatter about this morning and future plans.", type: "internal-text", location: "trainstation"}, { dialouge: "I look around for any open pole to hang onto and wait till I arrive at my destination. What to do…", type: "internal-text", location: "train"}, { dialouge: "Now that I think about it, we’re all just average. No one here, especially on this train, has anything to make them extraordinary.", type: "internal-text", location: "train"}, { dialouge: "We all fit together too well. Like a conglomerate of puzzle pieces. Puzzle pieces that were all shaped to match individually.", type: "internal-text", location: "train"}, {dialouge: "But me… that means I was shaped too. What was I shaped by? Myself or something else? Who even knows…", type: "internal-text", location: "train"}, { dialouge: "Either way, I am not too worried about it.", type: "internal-text", location: "train"}, {dialouge: "<b>Ding!</b>", type: "internal-text", location: "train", box: "e"}, { dialouge: "Either way, I am not too worried about it.", type: "internal-text", location: "train"}];


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
    let person = dialouge[0].person;
    if (type === "internal-text") {
        document.getElementById("character-image").style = "display: none;";
        console.log("Image changed");
    }
    else {
        document.getElementById("character-image").style = "display: block;";
        document.getElementById("character-image").src = `Assets/dialouge/${person.toLowerCase()}/${emotion.toLowerCase()}o.png`;
    }
}

function changeImageBack() {
    let emotion = dialouge[0].emotion;
    let type = dialouge[0].type;
    let person = dialouge[0].person;
    if (type === "internal-text") {
        document.getElementById("character-image").style = "display: none;";
        console.log("Image changed");
    }
    else {
        document.getElementById("character-image").style = "display: block;";
        document.getElementById("character-image").src = `Assets/dialouge/${person.toLowerCase()}/${emotion.toLowerCase()}.png`;
    }
}

function typeWriter(text) {
    let dialougeBackground = "url" + "(" + `Assets/Dialouge/${(text[0].location ?? "club").toLowerCase()}` +  ".png)";
    let choicesDiv = document.getElementById("choices")
    let textbox = document.getElementById("dialouge-text")
    let characterName = document.getElementById("dialouge-name")
    let dialougeBox = document.getElementById("dialouge-box")
    document.documentElement.style.setProperty('--dialouge-background', dialougeBackground);
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
        document.getElementById("character-image").src = `Assets/dialouge/MCThink.png`;
        document.documentElement.style.setProperty('--portrait-position', '34%');
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
                }
             else if (this.value == 1) {
                dialouge[0].dialouge = text[0].results[1].text;
                dialouge[0].type = "text"; // Change the type to text to prevent the choices from showing again
                choices.push({ choice: text[0].results[1].choice, value: text[0].results[1].value });
                localStorage.setItem('choices', JSON.stringify(choices)); // Store the choices array in localStorage
            }
            else if (this.value == 2) {
                dialouge[0].dialouge = text[0].results[2].text;
                dialouge[0].type = "text"; // Change the type to text to prevent the choices from showing again
                choices.push({ choice: text[0].results[2].choice, value: text[0].results[2].value });
                localStorage.setItem('choices', JSON.stringify(choices)); // Store the choices array in localStorage
            }
            enterKeyListener = true; // Re-enable the enter key listener after the choice is made
            typeWriter(dialouge); // Call the typeWriter function again to display the new dialouge

        };
        button.value = text[0].choices.indexOf(choice);
        choicesDiv.appendChild(button);
    });
}
else if (text[0].event) {
    if (text[0].event === "fight") {
        window.location.href = 'fight.html'
    }
}
else if (text[0].box){
    dialougeBox.src = `Assets/Dialouge/Dialougebox${text[0].box.toUpperCase()}.gif`;
}
else if (text[0].box === undefined) {
    dialougeBox.src = "Assets/Dialouge/DialougeboxN.gif";
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


