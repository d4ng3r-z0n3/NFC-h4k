const r = new NFCReader({compatibility: 'any'});
r.addEventListener('reading', event => {
  console.log(event);
  document.body.textContent = 'reading';

});
r.start();
document.body.textContent = new Date();
