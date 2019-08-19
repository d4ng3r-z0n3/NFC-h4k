
const r = new NFCReader({ compatibility: 'any' });

r.addEventListener('error', event => {
  pre.textContent += 'Error: ' + event.error + '\n';
});

r.addEventListener('reading', ({message}) => {
  pre.textContent += `> Reading from ${event.serialNumber}\n`;
  pre.textContent += `> URL: ${message.url}\n`;
  pre.textContent += `> Records:\n`;
  
  if (message.records.length === 0) {
    pre.textContent += `  > Empty tag\n`;
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
                   
});

const abortController = new AbortController();
abortController.signal.addEventListener('abort', _ => {
  pre.textContent += '> Aborted\n';
});

r.start({ signal: abortController.signal });
pre.textContent += 'Scanning...\n';

abortButton.addEventListener('click', _ => {
  abortController.abort();
});


writeButton.addEventListener('click', async _ => {
  const w = new NFCWriter();
  pre.textContent += 'Writing...\n';
  try {
    await w.push({
      url: "/custom/path",
      records: [{
        recordType: "text", data: 'Hello World'
      }, {
        // recordType: "url", data: 'https://www.google.com'
      // }, {
        recordType: "json", data: {key1: 'value1', key2: 'value2'}, mediaType: "application/json",
      }]
    });
    pre.textContent += '> Written\n';
  } catch(e) {
    pre.textContent += `> ${e}\n`;
  }
});

