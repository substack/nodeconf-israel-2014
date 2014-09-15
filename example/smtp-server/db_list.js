var blob = require('content-addressable-blob-store');
var through = require('through2');
var store = blob({ path: './blobs' });

var db = require('level')('./db', {
    keyEncoding: require('bytewise'),
    valueEncoding: 'json'
});

var box = process.argv[2];
var stream = db.createReadStream({
    gt: [ 'email', box, null ],
    lt: [ 'email', box, undefined ]
});

stream.pipe(through.obj(function (row, enc, next) {
    console.log('from:', row.value.from);
    console.log('-----------------------------');
    
    var r = store.createReadStream(row.value);
    r.pipe(process.stdout);
    r.on('end', next);
}));
