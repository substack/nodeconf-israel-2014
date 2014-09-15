var hybrid = require('hybrid-rsa-stream');
var fs = require('fs');
var privkey = fs.readFileSync(__dirname + '/files/private');

var dec = hybrid.decrypt(privkey, { encoding: 'base64' })
process.stdin.pipe(dec).pipe(process.stdout);
