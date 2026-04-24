// let dialogue = [{ dialogue: "Hello!", emotion: "happy", type: "text", person: "Sadie", location: "club" }, { dialogue: "Sad Hello", emotion: "sad", type: "text", person: "Sadie", location: "room" }, { dialogue: "You see a trash can, sitting innocently in the corner, potentially hiding the secrets of the universe within its maw. It almost seems to taunt you.", type: "internal-text" }, { dialogue: "Check inside the trash can?", type: "choice", choices: ["HELL YEAH", "No, wtf are you on about??", "Third Test Choice"], results: [{ text: "You give into your urges; the <b>animalistic</b> desire to know what <em>exactly</em> was in that trash can...only to find nothing.", choice: "checkedTrashCan", value: 1 }, { text: "You didnt check the trash can...Good job", choice: "checkedTrashCan", value: 0 }] }];

let dialogue = [{dialogue: "<b>Ring ring ring!</b>", type: "internal-text", location: "room", box: "e"}, {dialogue: "The alarm clock reverbs through my ears as the sound reaches my nerves. I jolt off of my bed from the ringing and mess up my hair.", type: "internal-text", location: "room"}, { dialogue: "<em>“Ouch… that hurt…”</em>", type: "internal-text", location: "room"}, { dialogue: "I sit up calmly and stretch all my limbs before I get up.", type: "internal-text", location: "room"}, { dialogue: "“Yuma! Come downstairs and eat your breakfast before you leave!”", type: "text", location: "room", person: "Mom", emotion: "happy"}, {dialogue: "My mom’s voice echoes from downstairs and up into my room.", type: "internal-text", location: "room"}, { dialogue: "“Yeah, yeah, I’m coming.” I said.", type: "internal-text", location: "room"}, {dialogue: "I change into my school uniform before heading downstairs and look in the mirror.", type: "internal-text", location: "room"}, { dialogue: "", type: "choice", location: "room", choices: ["Look in the mirror and reflect before you go", "Step away calmly and go", "Turn away abruptly and go"], results: [{ text: "“This is me… right?”", choice: "mirror", value: "0" }, { text: "“I don’t want to be late. I should go.”", choice: "mirror", value: "1"},{ text: "““No need to look.”", choice: "mirror", value: "2"} ]}, { dialogue: "I grab a steamy bun from the toaster and head out the door towards the train station.", type: "internal-text", location: "kitchen"}, { dialogue: "The train door opens with sounds rushing in of chatter about this morning and future plans.", type: "internal-text", location: "trainstation"}, { dialogue: "I look around for any open pole to hang onto and wait till I arrive at my destination. What to do…", type: "internal-text", location: "train"}, { dialogue: "Now that I think about it, we’re all just average. No one here, especially on this train, has anything to make them extraordinary.", type: "internal-text", location: "train"}, { dialogue: "We all fit together too well. Like a conglomerate of puzzle pieces. Puzzle pieces that were all shaped to match individually.", type: "internal-text", location: "train"}, {dialogue: "But me… that means I was shaped too. What was I shaped by? Myself or something else? Who even knows…", type: "internal-text", location: "train"}, { dialogue: "Either way, I am not too worried about it.", type: "internal-text", location: "train"}, {dialogue: "<b>Ding!</b>", type: "internal-text", location: "train", box: "e"}, { dialogue: "Either way, I am not too worried about it.", type: "internal-text", location: "train"}];


let conditionalDialogue = [{type: "conditional", condition: "mirror", dialogue: {1: "Looked In Mirror", 2: "Didnt Look In Mirror", 3: "Turned Away From Mirror"}}]

import "https://unpkg.com/typewriter-effect@latest/dist/core.js"; 
//Usage:
// Dialogue: What the character says....pretty simple
// Emotion: Changes the emotion of the character portrait
// type: "text" - normal dialogue, just text, "internal-text" - text that is meant to be internal monologue, so the character portrait will disappear, "choice" - gives the player a choice to make, and the results of that choice will change the dialogue based on what they choose
// choices: an array of choices for the player to choose from, only used if type is "choice"
// results: an array of results for each choice, only used if type is "choice", each result should have a text property that changes the dialogue, a choice property that is used to store the choice made in the choices array, and a value property that is used to store the value of the choice made in the choices array (for example, if the player checks the trash can, the value could be 1, if they dont check it, the value could be 0)
// {type: "conditional", typeafter:"internal-text", condition: "mirror", dialogue: {1: "Looked In Mirror", 2: "Didnt Look In Mirror", 3: "Turned Away From Mirror"}}, { dialogue: "Either way, I am not too worried about it.", type: "internal-text", location: "train"}

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
    let emotion = dialogue[0].emotion;
    let type = dialogue[0].type;
    let person = dialogue[0].person;
    if (type === "internal-text") {
        document.getElementById("character-image").style = "display: none;";
        console.log("Image changed");
    }
    else {
        document.getElementById("character-image").style = "display: block;";
        document.getElementById("character-image").src = `Assets/dialogue/${person.toLowerCase()}/${emotion.toLowerCase()}o.png`;
    }
}

function changeImageBack() {
    let emotion = dialogue[0].emotion;
    let type = dialogue[0].type;
    let person = dialogue[0].person;
    if (type === "internal-text") {
        document.getElementById("character-image").style = "display: none;";
        console.log("Image changed");
    }
    else {
        document.getElementById("character-image").style = "display: block;";
        document.getElementById("character-image").src = `Assets/dialogue/${person.toLowerCase()}/${emotion.toLowerCase()}.png`;
    }
}

function typeWriter(text) {
    let dialogueBackground = "url" + "(" + `Assets/Dialogue/${(text[0].location ?? "club").toLowerCase()}` +  ".png)";
    let choicesDiv = document.getElementById("choices")
    let textbox = document.getElementById("dialogue-text")
    let characterName = document.getElementById("dialogue-name")
    let dialogueBox = document.getElementById("dialogue-box")
    document.documentElement.style.setProperty('--dialogue-background', dialogueBackground);
    choicesDiv.innerHTML = ""; // Clear previous choices
    //Clear any previous text
    textbox.innerHTML = "";
    //Handle choices
    if (text[0].type === "choice") {
        //stop registering the enter key until a choice is made
        enterKeyListener = false;
        document.documentElement.style.setProperty('--gradient', 'rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)');
        dialogueBox.src = "Assets/Dialogue/thinkingcloud.png";
        textbox.style = "text-align: center;"
        document.getElementById("character-image").src = `Assets/dialogue/MCThink.png`;
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
                dialogueBox.src = "Assets/Dialogue/DialogueboxN.gif";
                document.documentElement.style.setProperty('--portrait-position', '14%');
                //Update the dialogue based on the choice given
                if (this.value == 0) {
                    dialogue[0].dialogue = text[0].results[0].text;
                    dialogue[0].type = "text"; // Change the type to text to prevent the choices from showing again
                    //push new object into choices array with the choice and value
                    choices.push({ choice: text[0].results[0].choice, value: text[0].results[0].value });
                    localStorage.setItem('choices', JSON.stringify(choices));
                }
             else if (this.value == 1) {
                dialogue[0].dialogue = text[0].results[1].text;
                dialogue[0].type = "text"; // Change the type to text to prevent the choices from showing again
                choices.push({ choice: text[0].results[1].choice, value: text[0].results[1].value });
                localStorage.setItem('choices', JSON.stringify(choices)); // Store the choices array in localStorage
            }
            else if (this.value == 2) {
                dialogue[0].dialogue = text[0].results[2].text;
                dialogue[0].type = "text"; // Change the type to text to prevent the choices from showing again
                choices.push({ choice: text[0].results[2].choice, value: text[0].results[2].value });
                localStorage.setItem('choices', JSON.stringify(choices)); // Store the choices array in localStorage
            }
            enterKeyListener = true; // Re-enable the enter key listener after the choice is made
            typeWriter(dialogue); // Call the typeWriter function again to display the new dialogue

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
    dialogueBox.src = `Assets/Dialogue/Dialoguebox${text[0].box.toUpperCase()}.gif`;
}
else if (text[0].box === undefined) {
    dialogueBox.src = "Assets/Dialogue/DialogueboxN.gif";
}

//type out the dialogue property of the first object in the dialogue array
const typewriter = new Typewriter(document.getElementById('dialogue-text'), {
    loop: false,
    delay: 30,
  });

  typewriter
  .typeString(text[0].dialogue)
  .start();

  state.isActive = true; // Trigger the image change when the typewriter starts
  characterName.innerText = text[0].person ? text[0].person : ""; // Set the character name if it exists, otherwise set it to an empty string
}



//wait for enter key, then call the typeWriter function with the dialogue array as an argument

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        if (enterKeyListener) {
            dialogue.shift(); // Remove the first element of the dialogue array after it's displayed
            if (dialogue[0].type === "conditional") {
                let condition = dialogue[0].condition;
                let value = 0;
                //Read local storage for the condition
                choices.forEach(choice => {
                    if (choice.choice === condition) {
                        value = choice.value;
                    }
                });
                dialogue[0].dialogue = dialogue[0].dialogue[value];
                dialogue[0].type = dialogue[0].typeafter; // Change the type to text to prevent the condition from being checked again
            typeWriter(dialogue);
            }
            else {
                typeWriter(dialogue);
            }
    }
    }
});

window.onload = function () {
    typeWriter(dialogue);

}


