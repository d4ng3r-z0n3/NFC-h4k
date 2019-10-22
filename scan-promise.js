const abortController = new AbortController();

controller.signal.onabort = event => {
  // Reset UI.
};

async function startReadingTag() {
  const reader = new NDEFReader();
  await reader.start({ signal: abortController.signal });
  reader.onreading = ({ serialNumber }) => {
    console.log({ serialNumber });
  };
}

function stopReadingTag() {
  abortController.abort();
}

function onStartButtonClick() {
  try {
    startReadingTag();
  } catch(e) {
    // Could not start scanning NFC tag.
  } finally {
  }