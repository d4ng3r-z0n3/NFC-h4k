const tagsColors = {
  "04:08:4c:0a:bb:5d:81": "red",
  "04:60:73:0a:bb:5d:80": "green",
  "04:68:6d:0a:bb:5d:81": "blue"
};

const reader = new NDEFReader();
reader.scan();
reader.addEventListener("reading", ({ serialNumber }) => {
  pre.textContent += `${tagsColors[serialNumber]}\n`;
});

function createSequence(number) {
  const sequence = [];
  const serialNumbers = Object.keys(tagsColors);
  while (serialNumbers.length) {
    const randomNumber = Math.floor(Math.random() * serialNumbers.length); 

    sequence.push(tagsColors)
  }
}
