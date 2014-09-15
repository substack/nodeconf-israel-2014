var smtp = require('smtp-protocol');
var blob = require('content-addressable-blob-store');
var store = blob({ path: './blobs' });

var db = require('level')('./db', {
    keyEncoding: require('bytewise'),
    valueEncoding: 'json'
});

var server = smtp.createServer(function (req) {
    req.on('message', function (stream, ack) {
        console.log('from: ' + req.from);
        console.log('to: ' + req.to);
        
        var w = store.createWriteStream();
        stream.pipe(w);
        
        w.on('finish', function () {
            req.to.forEach(function (to) {
                db.put([ 'email', to, Date.now() ], {
                    from: req.from,
                    hash: w.key
                });
            });
        });
        ack.accept();
    });
});
server.listen(5025);
