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

const sequence = createSequence();
(async _ => {
  await oneSec();
  for (const serialNumber of sequence) {
    // log(tagsColors[serialNumber]);
    html.style.backgroundColor = tagsColors[serialNumber];
    await oneSec();
  }
  html.style.backgroundColor = "white";
})();

const reader = new NDEFReader();
reader.scan();
reader.addEventListener("reading", ({ serialNumber }) => {
  if (serialNumber !== sequence.shift()) {
    log("LOST");
    return;
  }
  // log(tagsColors[serialNumber]);
  if (sequence.length === 0) {
    log("WIN");
    return;
  }
});

/* Utils */

function oneSec() {
  return new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
}

function log(text) {
  pre.textContent += `${text}\n`;
}
