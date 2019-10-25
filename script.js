const tagsColors = {
  "04:08:4c:0a:bb:5d:81": "red",
  "04:60:73:0a:bb:5d:80": "green",
  "04:68:6d:0a:bb:5d:81": "blue",
  "04:fa:3a:0a:bb:5d:80": "purple",
  "04:6c:8e:0a:bb:5d:80": "orange"
};

// Create random sequence of tags to tap in the right order.
let sequence = [];
const serialNumbers = Object.keys(tagsColors);
while (serialNumbers.length) {
  const randomIndex = Math.floor(Math.random() * serialNumbers.length);
  sequence = sequence.concat(serialNumbers.splice(randomIndex, 1));
}

// Show user colors to memorize.
(async _ => {
  for (const serialNumber of sequence) {
    await setColor(tagsColors[serialNumber]);
  }
  setColor("gainsboro");
})();

// Start listening to tags.
const reader = new NDEFReader();
reader.scan();
reader.addEventListener("reading", ({ serialNumber }) => {
  // User tapped wrong tag.
  if (serialNumber !== sequence.shift()) {
    setColor("");
    return;
  }

  // Show tag color user tapped.
  setColor(tagsColors[serialNumber]);

  // User tapped all tags in the right order.
  if (sequence.length === 0) {
    log("WIN");
  }
});

/* Utils */

function setColor(text) {
  color.style.backgroundColor = text;
  return new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
}

function log(text) {
  pre.textContent += `${text}\n`;
}
