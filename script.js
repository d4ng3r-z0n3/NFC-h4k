const audio = document.createElement("audio");
audio.src = "https://airhorner.com/sounds/airhorn.mp3";

function playSound() {
  if (!soundInput.checked) {
    return;
  }
  audio.currentTime = 0;
  audio.play();
}

const r = new NDEFReader();

r.onerror = ({ error }) => {
  pre.textContent += "Error: " + error + "\n";
};

const onReading = ({ message, serialNumber }) => {
  playSound();
  pre.textContent += `> Serial Number: ${serialNumber}\n`;
  pre.textContent += `> Records: (${message.records.length})\n`;

  if (message.records.length === 0) {
    pre.textContent += `  > No WebNFC records\n`;
    return;
  }

  for (const record of message.records) {
    console.log(record);
    pre.textContent += `  > recordType: ${record.recordType}\n`;
    pre.textContent += `  > mediaType: ${record.mediaType}\n`;
    pre.textContent += `  > id: ${record.id}\n`;
    pre.textContent += `  > lang: ${record.lang}\n`;
    pre.textContent += `  > encoding: ${record.encoding}\n`;

    const decoder = new TextDecoder();
    switch (record.recordType) {
      case "text":
        const textDecoder = new TextDecoder(record.encoding);
        pre.textContent += `  > data: ${textDecoder
          .decode(record.data)
          .replace(/[\r\n]/g, "")}\n`;
        break;
      case "url":
        pre.textContent += `  > data: ${decoder.decode(record.data)}\n`;
        break;
      default:
        pre.textContent += `  > data: ${record.data}\n`;
    }
    
    const text = record.text();
    if (text) {
      pre.textContent += `  > text(): ${record
        .text()
        .replace(/[\r\n]/g, "")}\n`;
    } else {
      pre.textContent += `  ! text(): ${text}\n`;
    }
    try {
      pre.textContent += `  > json(): ${record.json()}\n`;
    } catch (e) {
      pre.textContent += `  ! json(): ${e}\n`;
    }
    const arrayBuffer = record.arrayBuffer();
    if (!arrayBuffer) {
      // Remove when https://github.com/w3c/web-nfc/issues/371
      pre.textContent += `  > arrayBuffer(): ${arrayBuffer}\n`;
    } else if (record.mediaType.startsWith("image")) {
      pre.textContent += `  > arrayBuffer():\n`;
      // Try to show an image
      const blob = new Blob([record.arrayBuffer()], {
        type: record.mediaType
      });
      const img = document.createElement("img");
      img.src = URL.createObjectURL(blob);
      document.body.appendChild(img);
    } else {
      let a = [];
      const dataView = new DataView(arrayBuffer);
      for (let i = 0; i < arrayBuffer.byteLength; i++) {
        a.push("0x" + ("00" + dataView.getUint8(i).toString(16)).slice(-2));
      }
      pre.textContent += `  > arrayBuffer(${arrayBuffer.byteLength}): ${a.join(
        " "
      )}\n`;
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
  const w = new NDEFWriter();

  try {
//     await w.push(new ArrayBuffer());
//     pre.textContent += "> Written\n";
  
//     await w.push({
//       records: [
//         {
//           recordType: "url",
//           data: "https://youtube.com/"
//         }
//       ]
//     });
  
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
    const response = await fetch(
      "https://cdn.glitch.com/ffe1cfdc-67cb-4f9a-8380-6e9b1b69778d%2Fred.png"
    );
    const opaqueArrayBuffer = await response.arrayBuffer();
    const opaqueMediaType = response.headers.get("content-type");
    // await w.push(opaqueArrayBuffer);

    await w.push({
      records: [
        {
          id: "1",
          recordType: "text",
          lang: "fr",
          data: "bonjour"
        },
        {
          id: "2",
          recordType: "url",
          data: "https://google.com"
        },
        {
          id: "3",
          recordType: "json", // should be opaque?
          mediaType: "application/json",
          data: { key1: "value1", key2: "value2" }
        },
        {
          id: "4",
          recordType: "opaque",
          mediaType: opaqueMediaType,
          data: opaqueArrayBuffer
        },
        {
          id: "5",
          recordType: "android.com:pkg",
          data: new TextEncoder().encode(
            "org.chromium.webapk.ace0b15a6ce931426"
          ).buffer
        }
      ]
    });
    pre.textContent += "> Written\n";
  } catch (e) {
    pre.textContent += `> ${e}\n`;
  }
});

function writeTwitterWebApkToNfcTag() {
  const writer = new NDEFWriter();
  const encoder = new TextEncoder();
  const data = encoder.encode("org.chromium.webapk.ace0b15a6ce931426").buffer;

  return writer.push({
    recordType: "android.com:pkg",
    data
  });
}

function writeTwitterMobileToNfcTag() {
  const writer = new NDEFWriter();

  return writer.push({
    recordType: "url",
    data: "https://mobile.twitter.com"
  });
}
