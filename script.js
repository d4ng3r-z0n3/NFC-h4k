const r = new NFCReader({ compatibility: 'any' });
r.addEventListener('reading', event => {
  console.log(event);
  pre.textContent += 'reading\n';
});
r.addEventListener('error', event => {
  console.log(event);
  pre.textContent += event.error + '\n';
});
r.start();
pre.textContent = 'WebNFC - crbug.com/993327\n';
