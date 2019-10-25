const tagsColors = {
  "04:08:4c:0a:bb:5d:81": "red",
  "04:60:73:0a:bb:5d:80": "green",
  "04:68:6d:0a:bb:5d:81": "blue"
};

function createSequence() {
  const serialNumbers = Object.keys(tagsColors);
  let sequence = [];
  while (serialNumbers.length) {
    const randomIndex = Math.floor(Math.random() * serialNumbers.length);
    sequence = sequence.concat(serialNumbers.splice(randomIndex, 1));
  }
  return sequence;
}

const reader = new NDEFReader();
reader.scan();
reader.addEventListener("reading", ({ serialNumber }) => {
  log(tagsColors[serialNumber]);
  if (expectedSerialNumber)
});

const sequence = createSequence();
log("Play now!");
for (const serialNumber of sequence) {
  log(tagsColors[serialNumber]);
}

function log(text) {
  pre.textContent += `${text}\n`;
}
