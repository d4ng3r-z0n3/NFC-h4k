const url = new URL(location);
const compatibility = url.searchParams.get('compatibility') || 'any';
let r;
try {
  r = new NFCReader({ compatibility });
} catch(error) {
  pre.textContent += `Error: ${error}\n`;
}

r.onerror = event => {
  pre.textContent += 'Error: ' + event.error + '\n';
};

const onReading = ({ message }) => {
  pre.textContent += `> Reading from ${event.serialNumber}\n`;
  pre.textContent += `> URL: ${message.url}\n`;
  pre.textContent += `> Records:\n`;
  
  if (message.records.length === 0) {
    pre.textContent += `  > No WebNFC records\n`;
    return;
  }
  
  for (const record of message.records) {
    switch (record.recordType) {
      case "empty":
        pre.textContent += `  > Empty record\n`;
        break;
      case "text":
        pre.textContent += `  > Text: ${record.toText()}\n`;
        break;
      case "url":
        pre.textContent += `  > URL: ${record.toText()}\n`;
        break;
      case "json":
        pre.textContent += `  > JSON: ${JSON.stringify(record.toJSON())}\n`;
        break;
      case "opaque":
        if (record.mediaType.startsWith('image/')) {
          const blob = new Blob([record.toArrayBuffer()], {type: record.mediaType});

          const img = document.createElement("img");
          img.src = URL.createObjectURL(blob);
          img.onload = () => window.URL.revokeObjectURL(this.src);

          document.body.appendChild(img);
        }
        break;
    }
  }                 
};

const onReadingInputChange = _ => {
  r.onreading = readingInput.checked ? onReading : null;
}

readingInput.onchange = onReadingInputChange;
onReadingInputChange();

const abortController = new AbortController();
abortController.signal.addEventListener('abort', _ => {
  pre.textContent += '> Aborted\n';
});

r.start({ signal: abortController.signal });
pre.textContent += `Scanning "${compatibility}" technology...\n`;

abortButton.addEventListener('click', _ => {
  abortController.abort();
});

/* Write */

writeButton.addEventListener('click', async _ => {
  pre.textContent += 'Writing...\n';
  const w = new NFCWriter();
  try {
    await w.push({
      url: "/some/path",
      records: [{
        recordType: "text", data: 'hello'
      }, {
        recordType: "url", data: 'https://google.com'
      }, {
        recordType: "json", data: { key1: 'value1', key2: 'value2' }
      }]
    });
    pre.textContent += '> Written\n';
  } catch(e) {
    pre.textContent += `> ${e}\n`;
  }
});
