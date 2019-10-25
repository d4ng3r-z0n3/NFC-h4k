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
  if (serialNumber !== sequence[index]) {
    log("LOST");
    return;
  }
  log(tagsColors[serialNumber]);
  if (index === sequence.length - 1) {
    log("WIN");
    return;
  }
  index++;
});

const sequence = createSequence();
let index = 0;
log("Play now!");
(async _ => {
  for (const serialNumber of sequence) {
    document.querySelector("html").style.backgroundColor =
      tagsColors[serialNumber];
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    log(tagsColors[serialNumber]);
  }
})();

function log(text) {
  document.querySelector("pre").textContent += `${text}\n`;
}
