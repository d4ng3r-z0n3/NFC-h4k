const r = new NFCReader({compatibility: 'any'});
r.addEventListener('reading', event => {
  console.log(event);
  document.body.textContent += 'reading\n';
});
r.addEventListener('error', event => {
  console.log(event);
  document.body.textContent += event.error + '\n';
});
r.start();
document.body.textContent = 'WebNFC - crbug.com/993327\n';
