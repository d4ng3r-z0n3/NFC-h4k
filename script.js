const r = new NFCReader({compatibility: 'any'});
r.addEventListener('reading', event => {
  console.log(event);
  document.body.textContent = 'reading';
});
r.addEventListener('error', event => {
  console.log(event);
  document.body.textContent = event.error;
});
r.start();
document.body.textContent = new Date();
