
const r = new NFCReader({ compatibility: 'any' });
r.addEventListener('reading', ({message}) => {
  console.log(event);
  pre.textContent += `> Reading from ${event.serialNumber}\n`;
  
  if (message.records.length === 0) {
    pre.textContent += `> Empty tag\n`;
  }
  
  for (const record of message.records) {
    switch (record.recordType) {
      case "text":
        pre.textContent += `> Text: ${record.toText()}\n`;
        break;
      case "url":
        pre.textContent += `> URL: ${record.toText()}\n`;
        break;
      case "json":
        pre.textContent += `> JSON: ${JSON.stringify(record.toJSON())}\n`;
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
r.addEventListener('error', event => {
  pre.textContent += 'Error: ' + event.error + '\n';
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

