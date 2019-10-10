if (!NFCReader) {
  pre.textContent += `Error: ${error}\n`;
}

const audio = document.createElement("audio");
audio.src = "https://airhorner.com/sounds/airhorn.mp3";

function playSound() {
  audio.currentTime = 0;
  audio.play();
}

const r = new NFCReader();

r.onerror = event => {
  pre.textContent += "Error: " + event.error + "\n";
};

const onReading = ({ message }) => {
  // playSound();
  pre.textContent += `> Reading from ${event.serialNumber}\n`;
  pre.textContent += `> URL: ${message.url}\n`;
  pre.textContent += `> Records:\n`;

  if (message.records.length === 0) {
    pre.textContent += `  > No WebNFC records\n`;
    return;
  }

  for (const record of message.records) {
    pre.textContent += `\n`;
    pre.textContent += `  > recordType: ${record.recordType}\n`;
    pre.textContent += `  > mediaType: ${record.mediaType}\n`;
    pre.textContent += `  > id: ${record.id}\n`;
    pre.textContent += `  > toText(): ${record.toText()}\n`;
    pre.textContent += `  > toJSON(): ${record.toJSON()}\n`;
    pre.textContent += `  > toArrayBuffer(): ${record.toArrayBuffer()}\n`;
  }
  pre.textContent += `\n`;
};

const onReadingInputChange = _ => {
  r.onreading = readingInput.checked ? onReading : null;
};

readingInput.onchange = onReadingInputChange;
onReadingInputChange();

const abortController = new AbortController();
abortController.signal.addEventListener("abort", _ => {
  pre.textContent += "> Aborted\n";
});

r.scan({ signal: abortController.signal });
pre.textContent += `Scanning...\n`;

abortButton.addEventListener("click", _ => {
  abortController.abort();
});

/* Write */

writeButton.addEventListener("click", async _ => {
  pre.textContent += "Writing...\n";
  const w = new NFCWriter();

  try {
    await w.push({
      records: [
        {
          id: "1",
          recordType: "text",
          data: "hello"
        },
        {
          id: "2",
          recordType: "url",
          mediaType: "text/plain", // remove when https://bugs.chromium.org/p/chromium/issues/detail?id=1013167 is fixed
          data: "https://google.com"
        },
        {
          id: "2",
          recordType: "json",
          mediaType: "application/json",
          data: { key1: "value1", key2: "value2" }
        }
      ]
    });
    pre.textContent += "> Written\n";
  } catch (e) {
    pre.textContent += `> ${e}\n`;
  }
});
