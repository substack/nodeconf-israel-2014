var smtp = require('smtp-protocol');
var blob = require('content-addressable-blob-store');
var store = blob({ path: './blobs' });

var server = smtp.createServer(function (req) {
    req.on('message', function (stream, ack) {
        console.log('from: ' + req.from);
        console.log('to: ' + req.to);
        
        var w = store.createWriteStream();
        stream.pipe(w);
        
        ack.accept();
    });
});
server.listen(5025);
