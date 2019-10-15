function writeToNfcTag() {
  const writer = new NFCWriter();
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
    // UTF-16 handling
    const decoder = new TextDecoder();

    for (const record of message.records) {
      const data = record.data; // DataView like in Web Bluetooth, WebUSB, WebHID
      switch (record.recordType) {
        case "text":
          console.log(`Text: ${decoder.decode(data)}`);
          break;
        case "url":
          console.log(`URL: ${decoder.decode(data)}`);
          break;
        case "opaque":
          // Let developer handle opaque case
          if (record.mediaType === "application/json") {
            console.log(`JSON: ${JSON.parse(decoder.decode(data))}`);
          } else if (record.mediaType.startsWith("image/")) {
            const blob = new Blob(data, {
              type: record.mediaType
            });
            const img = document.createElement("img");
            img.src = URL.createObjectURL(blob);
            document.body.appendChild(img);
          } else {
            console.log(`Opaque: Not handled`);
          }
          break;
        case "android.com:pkg":
          console.log(`AAR Package Name: ${decoder.decode(data)}`);
          break;
      }
    }
  };
}
