const tagsColors = {
  "04:08:4c:0a:bb:5d:81": "red",
  "04:60:73:0a:bb:5d:80": "green",
  "04:68:6d:0a:bb:5d:81": "blue",
  "04:fa:3a:0a:bb:5d:80": "purple",
  "04:6c:8e:0a:bb:5d:80": "orange",
  "04:48:4c:0a:bb:5d:80": "black"
};

let serialNumbers = [];

const reader = new NDEFReader();

function onreading({ serialNumber }) {
  // User tapped wrong tag.
  if (serialNumber !== serialNumbers.shift()) {
    lost();
    return;
  }

  // Show tag color user tapped.
  setColor(tagsColors[serialNumber]);

  // User tapped all tags in the right order.
  if (serialNumbers.length === 0) win();
}

button.onclick = start;

/* Game logic */

async function start() {
  reset();

  // Create random sequence of tag serial numbers.
  const allSerialNumbers = Object.keys(tagsColors);
  serialNumbers = [];
  while (allSerialNumbers.length) {
    const randomIndex = Math.floor(Math.random() * allSerialNumbers.length);
    serialNumbers = serialNumbers.concat(
      allSerialNumbers.splice(randomIndex, 1)
    );
  }

  if (location.search.includes("god")) {
    pre.textContent = serialNumbers.map(
      serialNumber => tagsColors[serialNumber]
    );
  }

  // Show colors to memorize.
  for (const serialNumber of serialNumbers) {
    const card = setColor(tagsColors[serialNumber]);
    await new Promise(resolve => {
      setTimeout(_ => {
        resolve();
        card.style.backgroundColor = "";
      }, 500);
    });
  }

  // Start listening to tags.
  await reader.scan();
  reader.onreading = onreading;
}

function reset() {
  reader.onreading = null;
  Array.from(document.getElementById("cards").children).forEach(card => {
    card.style.backgroundColor = "";
    card.style.backgroundImage = "";
  });
  document.getElementById("button").classList.toggle("hidden", true);
}

function lost() {
  reset();
  Array.from(document.getElementById("cards").children).forEach(card => {
    card.style.backgroundImage =
      "url(https://cdn.glitch.com/a26fc0a9-d6cf-4b67-9100-2227eedddb62%2Floudly-crying-face.png?v=1573121443006)";
  });
  document.getElementById("button").classList.toggle("hidden", false);
}

function win() {
  reset();
  Array.from(document.getElementById("cards").children).forEach(card => {
    card.style.backgroundImage =
      "url(https://cdn.glitch.com/a26fc0a9-d6cf-4b67-9100-2227eedddb62%2Fface-with-party-horn-and-party-hat.png?v=1573121623577)";
  });
}

function setColor(text) {
  const cards = document.getElementById("cards").children;
  const card = cards[Object.values(tagsColors).indexOf(text)];
  card.style.backgroundColor = text;
  return card;
}
