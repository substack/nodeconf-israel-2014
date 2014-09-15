var blob = require('content-addressable-blob-store');
var store = blob({ path: './blobs' });

var w = store.createWriteStream();
process.stdin.pipe(w);

w.on('finish', function () {
    console.log('saved blob as ' + w.key);
});
