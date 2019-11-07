const tagsColors = {
  "04:08:4c:0a:bb:5d:81": "red",
  "04:60:73:0a:bb:5d:80": "green",
  "04:68:6d:0a:bb:5d:81": "blue",
  "04:fa:3a:0a:bb:5d:80": "purple",
  "04:6c:8e:0a:bb:5d:80": "orange"
};

let serialNumbers = [];

// Start listening to tags.
const reader = new NDEFReader();
reader.scan();
reader.addEventListener("reading", ({ serialNumber }) => {
  // User tapped wrong tag.
  if (serialNumber !== serialNumbers.shift()) {
    lost();
    return;
  }

  // Show tag color user tapped.
  setColor(tagsColors[serialNumber]);

  // User tapped all tags in the right order.
  if (serialNumbers.length === 0) {
    log("WIN");
  }
});

button.onclick = start;

/* Game logic */

async function start() {
  document.getElementById("cards").style.visibility = '';
  
  // Create random sequence of tag serial numbers.
  const allSerialNumbers = Object.keys(tagsColors);
  while (allSerialNumbers.length) {
    const randomIndex = Math.floor(Math.random() * allSerialNumbers.length);
    serialNumbers = serialNumbers.concat(
      allSerialNumbers.splice(randomIndex, 1)
    );
  }
  // Show colors to memorize.
  for (const serialNumber of serialNumbers) {
    const card = setColor(tagsColors[serialNumber]);
    await new Promise(resolve => {
      setTimeout(_ => {
        resolve();
        card.style.backgroundColor = "";
      }, 200);
    });
  }
};

function lost() {
   document.getElementById("cards").style.visibility = 'hidden';
}

function win() {
   document.getElementById("cards").style.visibility = 'hidden';
}

/* Utils */

function setColor(text) {
  const cards = document.getElementById("cards").children;
  const card = cards[Object.values(tagsColors).indexOf(text)];
  card.style.backgroundColor = text;
  return card;
}

function log(text) {
  pre.textContent += `${text}\n`;
}

