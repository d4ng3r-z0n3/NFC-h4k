if (!NFCReader) {
  pre.textContent += `Error: ${error}\n`;
}

const audio = document.createElement("audio");
audio.src = "https://airhorner.com/sounds/airhorn.mp3";

function playSound() {
  if (!soundInput.checked) {
    return;
  }
  audio.currentTime = 0;
  audio.play();
}

const r = new NFCReader();

r.onerror = ({ error }) => {
  pre.textContent += "Error: " + error + "\n";
};

const onReading = ({ message, serialNumber }) => {
  playSound();
  pre.textContent += `> Serial Number: ${serialNumber}\n`;
  pre.textContent += `> URL: ${message.url}\n`;
  pre.textContent += `> Records: (${message.records.length})\n`;

  if (message.records.length === 0) {
    pre.textContent += `  > No WebNFC records\n`;
    return;
  }

  for (const record of message.records) {
    pre.textContent += `  > recordType: ${record.recordType}\n`;
    pre.textContent += `  > mediaType: ${record.mediaType}\n`;
    pre.textContent += `  > id: ${record.id}\n`;
    pre.textContent += `  > toText(): ${record.toText().replace(/[\r\n]/g, "")}\n`;
    try {
      pre.textContent += `  > toJSON(): ${record.toJSON()}\n`;
    } catch (e) {
      pre.textContent += `  ! toJSON(): ${e}\n`;
    }
    if (record.recordType != "opaque") {
      pre.textContent += `  > toArrayBuffer(): ${record.toArrayBuffer()}\n`;
    } else {
      pre.textContent += `  > toArrayBuffer():\n`;
      // Try to show an image
      const blob = new Blob([record.toArrayBuffer()], {
        type: record.mediaType
      });
      const img = document.createElement("img");
      img.src = URL.createObjectURL(blob);
      document.body.appendChild(img);
    }
    //pre.textContent += `  > toRecords(): ${record.toRecords()}\n`;
    pre.textContent += `  - - - - - - - \n`;
  }
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
    // DOMString text
    // await w.push('DOMString');
    
    // DOMString json
    // await w.push(JSON.stringify({key1: 'value1'}));

    // NDEFMessageInit text + json
    // await w.push({
    //   records: [
    //     {
    //       id: "1",
    //       recordType: "text",
    //       data: JSON.stringify({ key1: "value1" })
    //     },
    //     {
    //       id: "2",
    //       recordType: "json",
    //       mediaType: "application/json",
    //       data: { key1: "value1" }
    //     }
    //   ]
    // });

    // NDEFMessgeInit arrayBuffer
    const response = await fetch("https://cdn.glitch.com/ffe1cfdc-67cb-4f9a-8380-6e9b1b69778d%2Fred.png");
    const arrayBuffer = await response.arrayBuffer();
    // await w.push({
    //   records: [
    //     {
    //       id: "1",
    //       recordType: "opaque",
    //       mediaType: "application/octet-stream",
    //       data: arrayBuffer
    //     }
    //   ]
    // });
    // await w.push(arrayBuffer);

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
          id: "3",
          recordType: "json",
          mediaType: "application/json",
          data: { key1: "value1", key2: "value2" }
        },
        {
          id: "4",
          recordType: "opaque",
          mediaType: "application/octet-stream",
          data: arrayBuffer
        }
      ]
    });
    pre.textContent += "> Written\n";
  } catch (e) {
    pre.textContent += `> ${e}\n`;
  }
});
