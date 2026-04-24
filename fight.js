const overlay = document.getElementById("overlay"); 
const overlayTitle = document.getElementById("overlayTitle");
const overlayContent = document.getElementById("overlayContent");
const closeOverlayButton = document.getElementById("closeOverlayButton");
const menuButtons = Array.from(document.querySelectorAll(".battle-btn"));
const menuCaption = document.getElementById("menuCaption");
const battleMessage = document.getElementById("battleMessage");
const battleLog = document.getElementById("battleLog");
const turnLabel = document.getElementById("turnLabel");
const enemyIntent = document.getElementById("enemyIntent");
const mercyValue = document.getElementById("mercyValue");
const restartButton = document.getElementById("restartButton");
const battleMusic = document.getElementById("battleMusic");

// the team in an array basically
const party = [
    {
        id: "sadie",
        name: "Sadie",
        maxHp: 32,
        hp: 32,
        damage: [7, 11],
        healBonus: 0,
        element: document.getElementById("combatant-sadie"),
        hpElement: document.getElementById("hp-sadie"),
        barElement: document.getElementById("bar-sadie")
    },
    {
        id: "akira",
        name: "Akira",
        maxHp: 44,
        hp: 44,
        damage: [10, 15],
        healBonus: 3,
        element: document.getElementById("combatant-akira"),
        hpElement: document.getElementById("hp-akira"),
        barElement: document.getElementById("bar-akira")
    },
    {
        id: "momo",
        name: "Momo",
        maxHp: 28,
        hp: 28,
        damage: [6, 10],
        healBonus: 5,
        element: document.getElementById("combatant-momo"),
        hpElement: document.getElementById("hp-momo"),
        barElement: document.getElementById("bar-momo")
    }
];

//enemy data in an object similar to party members
const enemy = {
    name: "Shadow Sadie",
    maxHp: 670,
    hp: 670,
    mercy: 0,
    element: document.getElementById("combatant-enemy"),
    hpElement: document.getElementById("hp-enemy"),
    barElement: document.getElementById("bar-enemy")
};

//item data in an array, set for now but later will change dependign on what the player picks up 
const itemData = [
    { id: "tea", name: "Mint Tea", description: "Heal 12 HP", uses: 2, heal: 12 },
    { id: "bandage", name: "Bandage", description: "Heal 18 HP", uses: 1, heal: 18 },
    { id: "snack", name: "Lucky Snack", description: "Heal 9 HP", uses: 3, heal: 9 }
];

//options for acting on the enemy, with mercy values and damage
const actData = [
    { id: "check", name: "Check", description: "Read the enemy", mercy: 6 },
    { id: "talk", name: "Talk", description: "Calm the tension", mercy: 12 },
    { id: "encourage", name: "Encourage", description: "Raise party spirit", mercy: 18 },
    { id: "challenge", name: "Challenge", description: "Deal 8 damage, gain mercy", mercy: 10, damage: 8 }
];

// state object to track every like status and stuff
const state = {
    activeMenu: null,
    turn: 1,
    battleOver: false,
    lastIntent: null
};
// keeps random number betwene min max range like in a limit so stuff like hp cant go below 0 or above max hp
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
// random number between a min and max, mainly used for damagae and stuff
function roll(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//so if member is above 0 then they are alive in fight and this is returned as an array of alive members
function aliveParty() {
    return party.filter((member) => member.hp > 0);
}
// main battle message that changes like if you hit the enemy or sumn
function setMessage(text) {
    battleMessage.textContent = text;
}
// adds message to battle log
function logMessage(text) {
    const entry = document.createElement("p");
    entry.className = "battle-log-entry";
    entry.textContent = text;
    battleLog.prepend(entry);
// only keeps the 4 most recent messages here
    while (battleLog.children.length > 4) {
        battleLog.removeChild(battleLog.lastChild);
    }
}
// adds highlight class element and then removes it to show they are acting
function highlightCombatant(element) {
    element.classList.add("is-active");
    window.setTimeout(() => element.classList.remove("is-active"), 350);
}
// hit effect so if you get hit or enemy it flashes red for a moment
function flashHit(element) {
    element.classList.add("is-hit");
    window.setTimeout(() => element.classList.remove("is-hit"), 250);
}
// hp bar and hp text update for a combatant, and if they get defeated then it adds defeated class to show they are down
function updateCombatant(member) {
    const ratio = clamp((member.hp / member.maxHp) * 100, 0, 100);
    member.hpElement.textContent = `${member.hp} / ${member.maxHp}`;
    member.barElement.style.width = `${ratio}%`;
    member.element.classList.toggle("is-defeated", member.hp <= 0);
}
// same as update combatant but also updates mercy and intent for the enemy
function updateEnemy() {
    const ratio = clamp((enemy.hp / enemy.maxHp) * 100, 0, 100);
    enemy.hpElement.textContent = `${enemy.hp} / ${enemy.maxHp}`;
    enemy.barElement.style.width = `${ratio}%`;
    enemy.element.classList.toggle("is-defeated", enemy.hp <= 0);
    mercyValue.textContent = `${enemy.mercy}%`;
}
// updates the turn label at the top to show current turn and if battle is finished or not
function updateTurnLabel() {
    turnLabel.textContent = enemy.hp <= 0 || state.battleOver
        ? `Turn ${state.turn} - Battle finished`
        : `Turn ${state.turn} - Your move`;
}
// calls all the update functions to refresh screen after actions
function renderAll() {
    party.forEach(updateCombatant);
    updateEnemy();
    updateTurnLabel();
}
// removes active class from all menu buttons so no highlighted
function clearActiveButtons() {
    menuButtons.forEach((button) => button.classList.remove("active"));
}
// disables or enables all menu buttons, basically for when battle is over or when waiting for enemy to attack the player so they cant do anything funny
function setButtonsDisabled(disabled) {
    menuButtons.forEach((button) => {
        button.disabled = disabled;
    });
}
// hides overlay and clears
function closeOverlay() {
    state.activeMenu = null;
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
    overlayContent.innerHTML = "";
    clearActiveButtons();
}
// ends battle
function endBattle(message) {
    state.battleOver = true;
    closeOverlay();
    setButtonsDisabled(true);
    battleMusic.pause(); 
    setMessage(message);
    updateTurnLabel();
}
// randomly picks an intent for enemy each turn, so the 3 options for enemy attack and show on screen
function refreshIntent() {
    const options = [
        { label: "Sharp strike for 8-14 damage", min: 8, max: 14 },
        { label: "Heavy swing for 10-16 damage", min: 10, max: 16 },
        { label: "Wild lunge for 6-18 damage", min: 6, max: 18 }
    ];

    state.lastIntent = options[roll(0, options.length - 1)];
    enemyIntent.textContent = `Intent: ${state.lastIntent.label}`;
}
// when restart battle reset items so you can fight again (wont be necessary later on)
function resetItems() {
    itemData.forEach((item) => {
        if (item.id === "tea") {
            item.uses = 2;
        } else if (item.id === "bandage") {
            item.uses = 1;
        } else if (item.id === "snack") {
            item.uses = 3;
        }
    });
}
// restart everything to battle again
function restartBattle() {
    state.activeMenu = null;
    state.turn = 1;
    state.battleOver = false;
    enemy.hp = enemy.maxHp;
    enemy.mercy = 0;

    party.forEach((member) => {
        member.hp = member.maxHp;
    });

    resetItems();
    setButtonsDisabled(false);
    closeOverlay();
    battleLog.innerHTML = "";
    refreshIntent();
    setMessage("Shadow Sadie steps in from the right. Pick a command.");
    menuCaption.textContent = "Choose a command for the party.";
      battleMusic.currentTime = 0; // start from beginning
    battleMusic.play().catch(() => {
        console.log("Autoplay blocked until user interacts.");
    });
    renderAll();
}
// enemy attack function here, it picks a random target and deals random damage and updates ui and check for defeat, then advance turns ad yeah
function enemyAttack() {
    const livingMembers = aliveParty();

    if (livingMembers.length === 0 || enemy.hp <= 0) {
        return;
    }
// randomly picks a target from the alive party members
    const target = livingMembers[roll(0, livingMembers.length - 1)];
    const damage = roll(state.lastIntent.min, state.lastIntent.max);
    target.hp = clamp(target.hp - damage, 0, target.maxHp);
    flashHit(target.element);
    highlightCombatant(enemy.element);
    updateCombatant(target);
// if target hp is 0 then they are knocked out and message says that
    if (target.hp === 0) {
        logMessage(`${enemy.name} knocks ${target.name} out for the turn.`);
        setMessage(`${enemy.name} hits ${target.name} for ${damage}. ${target.name} is down.`);
    } else {
        logMessage(`${enemy.name} hits ${target.name} for ${damage} damage.`);
        setMessage(`${enemy.name} targets ${target.name} for ${damage} damage.`);
    }
// if all party members are knocked out then battle is over and message says that
    if (aliveParty().length === 0) {
        endBattle("Your party collapses. Press Restart Demo to try again.");
        return;
    }
// advance turn and refresh intent for next enemy attack
    state.turn += 1;
    refreshIntent();
    renderAll();
}
//ends player action and closes the overlay and then checks if enemy is defeated and if not then it repeats enemy turn after
function finishPlayerAction(summary) {
    closeOverlay();
    renderAll();

    if (enemy.hp <= 0) {
        endBattle("Shadow Sadie dissolves into static. Victory.");
        logMessage("The party wins the demo battle.");
        return;
    }

    if (summary) {
        setMessage(summary);
    }
// disable buttons while waiting for enemy turn to prevent player from spamming actions before enemy attacks
    setButtonsDisabled(true);
    window.setTimeout(() => {
        if (!state.battleOver) {
            enemyAttack();
            if (!state.battleOver) {
                setButtonsDisabled(false);
                menuCaption.textContent = "Choose a command for the next turn.";
            }
        }
    }, 700);
}
// find strongest living memeber to target healing items, i didnt know wat to do here for the items and idk how to do the selection for now so i kinda just made it so it picked the strongest person
function strongestLivingMember() {
    const livingMembers = aliveParty();
    return livingMembers.sort((a, b) => a.hp - b.hp)[0] || null;
}
// makes all members attack and adds up damage
function fightAction() {
    if (state.battleOver) {
        return;
    }

    closeOverlay();
    const attackers = aliveParty();
    let totalDamage = 0;

    attackers.forEach((member) => {
        const strike = roll(member.damage[0], member.damage[1]);
        totalDamage += strike;
        highlightCombatant(member.element);
    });

    enemy.hp = clamp(enemy.hp - totalDamage, 0, enemy.maxHp);
    flashHit(enemy.element);
    logMessage(`The party attacks together for ${totalDamage} total damage.`);
    finishPlayerAction(`The party rushes ${enemy.name} for ${totalDamage} damage.`);
}
// uses an item, checks if it has uses left, heals the strongest living member, updates UI and logs the action, then finishes player action
function useItem(itemId) {
    if (state.battleOver) {
        return;
    }

    const item = itemData.find((entry) => entry.id === itemId);

    if (!item || item.uses <= 0) {
        setMessage("That item is empty.");
        return;
    }

    const target = strongestLivingMember();

    if (!target) {
        return;
    }

    const healAmount = Math.min(item.heal + target.healBonus, target.maxHp - target.hp);

    if (healAmount <= 0) {
        setMessage(`${target.name} is already at full health.`);
        return;
    }

    item.uses -= 1;
    target.hp = clamp(target.hp + healAmount, 0, target.maxHp);
    highlightCombatant(target.element);
    logMessage(`${target.name} uses ${item.name} and restores ${healAmount} HP.`);
    finishPlayerAction(`${target.name} uses ${item.name} and heals ${healAmount} HP.`);
}
//applies selected action raising up mercy meter or dealing damage, updates UI and logs the action, then finishes player action
function actOnEnemy(actId) {
    if (state.battleOver) {
        return;
    }

    const action = actData.find((entry) => entry.id === actId);

    if (!action) {
        return;
    }

    enemy.mercy = clamp(enemy.mercy + action.mercy, 0, 100);
    let summary = `${action.name} works. Mercy rises to ${enemy.mercy}%.`;

    if (action.id === "check") {
        summary = `${enemy.name}: 670 HP shell, weak to group attacks, mercy builds fast after encouragement.`;
    } else if (action.id === "talk") {
        summary = "You try talking her down. The tension softens.";
    } else if (action.id === "encourage") {
        summary = "The party encourages each other. Shadow Sadie hesitates.";
    } else if (action.id === "challenge") {
        enemy.hp = clamp(enemy.hp - action.damage, 0, enemy.maxHp);
        flashHit(enemy.element);
        summary = `Challenge lands for ${action.damage} damage and pushes mercy to ${enemy.mercy}%.`;
    }

    if (enemy.mercy >= 100 && enemy.hp > 0) {
        summary = `${summary} Mercy is full. You can Spare now.`;
    }

    logMessage(summary);
    finishPlayerAction(summary);
}
// tries to spare the enemy, if mercy is 100 then it wins the battle, if not then it logs that spare failed and how much mercy there is
function spareEnemy() {
    if (state.battleOver) {
        return;
    }

    closeOverlay();

    if (enemy.mercy >= 100) {
        enemy.hp = 0;
        finishPlayerAction("You offer mercy. Shadow Sadie accepts.");
        return;
    }

    logMessage(`Spare fails at ${enemy.mercy}% mercy.`);
    finishPlayerAction(`Mercy is only ${enemy.mercy}%. You need 100% to spare.`);
}
// a button element with text, description, click behavior, and disabled state for overlay menus.
function createOverlayButton(label, description, onClick, disabled = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "overlay-item";
    button.disabled = disabled;
    button.innerHTML = `${label}<small>${description}</small>`;
    button.addEventListener("click", onClick);
    return button;
}
// renders the inventory menu with buttons for each item, showing uses left and description, and sets up click behavior to use the item
function renderInventoryMenu() {
    overlayTitle.textContent = "Inventory";
    overlayContent.innerHTML = "";

    itemData.forEach((item) => {
        const label = `${item.name} x${item.uses}`;
        const button = createOverlayButton(
            label,
            item.description,
            () => useItem(item.id),
            item.uses <= 0
        );
        overlayContent.appendChild(button);
    });
}
// renders the act menu with buttons for each action, showing description, and sets up click behavior to perform the action
function renderActMenu() {
    overlayTitle.textContent = "Act";
    overlayContent.innerHTML = "";

    actData.forEach((action) => {
        const button = createOverlayButton(
            action.name,
            action.description,
            () => actOnEnemy(action.id)
        );
        overlayContent.appendChild(button);
    });
}
// opens the specified menu overlay, renders the appropriate content, and sets up the UI state for interaction, menu closes if same overlay clicked again
function openOverlay(menuType) {
    if (state.battleOver) {
        return;
    }

    if (state.activeMenu === menuType) {
        closeOverlay();
        return;
    }

    state.activeMenu = menuType;
    clearActiveButtons();
    document.querySelector(`[data-menu="${menuType}"]`)?.classList.add("active");

    if (menuType === "inventory") {
        renderInventoryMenu();
    } else if (menuType === "act") {
        renderActMenu();
    } else {
        closeOverlay();
        return;
    }

    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
}
// sets up click event listeners for menu buttons to open the corresponding overlay or perform actions, and for close and restart buttons
menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const menuType = button.dataset.menu;

        if (menuType === "fight") {
            fightAction();
            return;
        }

        if (menuType === "inventory" || menuType === "act") {
            openOverlay(menuType);
            return;
        }

        if (menuType === "spare") {
            spareEnemy();
        }
    });
});

closeOverlayButton.addEventListener("click", closeOverlay);
restartButton.addEventListener("click", restartBattle);
//if escape pressed then close overlay
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeOverlay();
    }
});
// restarto!
restartBattle();