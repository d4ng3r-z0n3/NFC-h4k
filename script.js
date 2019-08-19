
const r = new NFCReader({ compatibility: 'any' });
r.addEventListener('reading', ({message}) => {
  console.log(event);
  pre.textContent += `reading from ${event.serialNumber}\n`;
  
  
  for (const record of message.records) {
    switch (record.recordType) {
      case "text":
        pre.textContent += `Text: ${record.toText()}\n`;
        break;
      case "url":
        pre.textContent += `URL: ${record.toText()}\n`;
        break;
      case "json":
        pre.textContent += `JSON: ${JSON.stringify(record.toJSON())}\n`;
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
  console.log(event);
  pre.textContent += event.error + '\n';
});

const abortController = new AbortController();

r.start({ signal: abortController.signal });
pre.textContent = 'scanning...\n';

abortButton.addEventListener('click', _ => {
  controller.abort();
});
