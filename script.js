const tags = [
  {
    serialNumber: "04:08:4c:0a:bb:5d:81",
    color: "red"
  },
  {
    serialNumber: "04:60:73:0a:bb:5d:80",
    color: "green"
  },
  {
    serialNumber: "04:68:6d:0a:bb:5d:81",
    color: "blue"
  }
];
const reader = new NDEFReader();
reader.scan();
reader.onReading = ({ serialNumber }) => {
  pre.textContent += `> Serial Number: ${serialNumber}\n`;
};
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
    // pre.textContent += "> Written\n";
    // return;

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
          encoding: "utf-16",
          data: a2utf16("Bonjour, François !")
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

function a2utf16(string) {
  let result = new Uint16Array(string.length);
  for (let i = 0; i < string.length; i++) {
    result[i] = string.codePointAt(i);
  }
  return result;
}
