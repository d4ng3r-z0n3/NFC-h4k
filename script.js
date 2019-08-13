const r = new NFCReader({compatibility: 'any'});
r.addEventListener('reading', event => {
  console.log(event);
});
r.start();