var hybrid = require('hybrid-rsa-stream');
var fs = require('fs');
var pubkey = fs.readFileSync(__dirname + '/files/public');

var enc = hybrid.encrypt(pubkey, { encoding: 'base64' });
process.stdin.pipe(enc).pipe(process.stdout);
