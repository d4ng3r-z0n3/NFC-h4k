function writeToNfcTag() {
  const writer = new NFCWriter();
  const encoder = new TextEncoder();
  const data = encoder.encode("org.chromium.webapk.ace0b15a6ce931426").buffer;

  return writer.push({
    records: [
      {
        id: "1",
        recordType: "text",
        data: "hello"
      },
      {
        id: "2",
        recordType: "url",
        data: "https://google.com"
      },
      {
        id: "3",
        recordType: "opaque",
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
        data: new TextEncoder().encode("org.chromium.webapk.ace0b15a6ce931426")
          .buffer
      }
    ]
  });
}

function readNfcTag() {
  const reader = new NFCReader();
  reader.scan();
  reader.onreading = ({ message }) => {
    
  const decoder = new TextDecoder();
    
  for (const record of message.records) {
    switch (record.recordType) {
      case "text":
        console.log(`Text: ${decoder.decode(value)}`);
        break;
      case "url":
        console.log(`URL: ${record.text()}`);
        break;
      case "opaque":
        // Let developer handle opaque case
        if (record.mediaType === 'application/json') {
          console.log(`JSON: ${JSON.parse(record.text())}`);
        } else if (record.mediaType.startsWith('image/')) {
          const blob = new Blob([record.arrayBuffer()], {type: record.mediaType});
          const img = document.createElement("img");
          img.src = URL.createObjectURL(blob);
          document.body.appendChild(img);
        };
        break;
      case "android.com:pkg":
        const decoder = new TextDecoder();
        decoder.decode
    }
  }


    for (const record of message.records) {
      if (record.recordType === 'text') {
        console.log('Text : ' + record.text());
      } else if (record.recordType === 'url') {
        console.log('URL : ' + record.text());
      } else if 
      pre.textContent += `  > recordType: ${record.recordType}\n`;
      pre.textContent += `  > mediaType: ${record.mediaType}\n`;
      pre.textContent += `  > id: ${record.id}\n`;
      pre.textContent += `  > toText(): ${record
        .toText()
        .replace(/[\r\n]/g, "")}\n`;
      const arrayBuffer = record.toArrayBuffer();
      if (!arrayBuffer) {
        // Remove when https://github.com/w3c/web-nfc/issues/371
        pre.textContent += `  > toArrayBuffer(): ${arrayBuffer}\n`;
      } else if (record.mediaType.startsWith("image")) {
        pre.textContent += `  > toArrayBuffer():\n`;
        // Try to show an image
        const blob = new Blob([record.toArrayBuffer()], {
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
        pre.textContent += `  > toArrayBuffer(): ${a.join(" ")}\n`;
      }
      //pre.textContent += `  > toRecords(): ${record.toRecords()}\n`;
      pre.textContent += `  - - - - - - - \n`;
    }
  };
}
