var blob = require('content-addressable-blob-store');
var store = blob({ path: './blobs' });

var key = process.argv[2];
var r = store.createReadStream({ key: key });
r.pipe(process.stdout);
