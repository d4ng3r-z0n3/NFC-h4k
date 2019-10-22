const reader = new NDEFReader();
reader.scan({
  recordType: "media",
  mediaType: "application/*json"
});
reader.onreading = event => {
  const decoder = new TextDecoder();
  for (const record of event.message.records) {
    if (record.mediaType === "application/json") {
      const json = JSON.parse(decoder.decode(record.data));
      const article = /^[aeio]/i.test(json.title) ? "an" : "a";
      console.log(`${json.name} is ${article} ${json.title}`);
    }
  }
};

const writer = new NDEFWriter();
const encoder = new TextEncoder();
writer.push({
  records: [
    {
      recordType: "media",
      mediaType: "application/json",
      data: encoder.encode(
        JSON.stringify({
          name: "Benny Jensen",
          title: "Banker"
        })
      )
    },
    {
      recordType: "media",
      mediaType: "application/json",
      data: encoder.encode(
        JSON.stringify({
          name: "Zoey Braun",
          title: "Engineer"
        })
      )
    }
  ]
});

// actually I guess that unknown records could be useful inside external records
// as its your record, so you know what it represents and can avoid storing the mime type\
const writer = NDEFWriter();
writer.push({
  records: [
    {
      recordType: "example.com:shoppingItem", // External record
      data: {
        records: [
          {
            recordType: "unknown", // Shopping ID
            data: Uint8Array.of(1234)
          },
          {
            recordType: "unknown", // Shopping item description
            data: new TextEncoder().encode("NFC Tag Sticker")
          }
        ]
      }
    }
  ]
});
