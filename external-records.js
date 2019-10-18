const reader = new NFCReader();
reader.scan({
  recordType: "media",
  mediaType: "application/*json"
});
reader.onreading = event => {
  const decoder = new TextDecoder();
  for (const record of event.message.records) {
    if (record.mediaType === 'application/json') {
      const json = JSON.parse(decoder.decode(record.data));
      const article =/^[aeio]/i.test(json.title) ? "an" : "a";
      console.log(`${json.name} is ${article} ${json.title}`);
    }
  }
};

const writer = new NFCWriter();
const encoder = new TextEncoder();
writer.push({
  records: [
    {
      recordType: "media",
      mediaType: "application/json",
      data: encoder.encode(JSON.stringify({
        name: "Benny Jensen",
        title: "Banker"
      }))
    },
    {
      recordType: "media",
      mediaType: "application/json",
      data: encoder.encode(JSON.stringify({
        name: "Zoey Braun",
        title: "Engineer"
      }))
    }]
});


writer.push({ records: [
  {
    recordType: "external",
    data: {
      records: [
        {
          recordType: "example.com:shoppingItem",
          data: Uint8rray.of(...1234)
        },
        {
          recordType: "example.com:shoppingItem",
          data: "Game context given here"
        },
        {
          recordType: "media",
          mediaType: "image/png"
          data: getImageBytes(fromURL);
        }
      ]
    }
  }
]});