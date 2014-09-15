# modular email

substack.net

---

# how email works

* smtp
* imap
* pop3 (defunct)

---

# email: broken

---

# email: broken

* plaintext fallback for TLS

---

# email: broken

* no built-in security, verification

---

# email: broken

* imap data structures

---

# email: broken

...but we still need email for now

---

# email: broken

the solution: modularity

---

# email: broken

the solution(s): modularity, gpg

---

# smtp-protocol

module: smtp-protocol

bad ideas:

* fallback to plaintext
* unsocilicted messages
* no verification, we can send an email from the president!

---

# smtp-protocol

``` js
var smtp = require('smtp-protocol');

var server = smtp.createServer(function (req) {
    req.on('message', function (stream, ack) {
        // ack.accept(), ack.reject()...
    });
});
server.listen(5025);
```

---

# smtp-protocol

``` js
var smtp = require('smtp-protocol');

var server = smtp.createServer(function (req) {
    req.on('message', function (stream, ack) {
        console.log('from: ' + req.from);
        console.log('to: ' + req.to);
        
        stream.pipe(process.stdout, { end : false });
        ack.accept();
    });
});
server.listen(5025);
```

---

# blob-storage (writing)

``` js
var blob = require('content-addressable-blob-store');
var store = blob({ path: './blobs' });

var w = store.createWriteStream();
process.stdin.pipe(w);
```

---

# blob-storage (writing)

``` js
var blob = require('content-addressable-blob-store');
var store = blob({ path: './blobs' });

var w = store.createWriteStream();
process.stdin.pipe(w);

w.on('finish', function () {
    console.log('saved blob as ' + w.key);
});
```

---

# blob-storage (reading)

``` js
var blob = require('content-addressable-blob-store');
var store = blob({ path: './blobs' });

var w = store.createWriteStream();
process.stdin.pipe(w);

w.on('finish', function () {
    console.log('saved blob as ' + w.key);
});
```

---

# smtp-protocol

``` js
var smtp = require('smtp-protocol');

var server = smtp.createServer(function (req) {
    req.on('message', function (stream, ack) {
        console.log('from: ' + req.from);
        console.log('to: ' + req.to);
        
        // we can use a content-addressable blob store here
        
        ack.accept();
    });
});
server.listen(5025);
```

---

## imap

bad ideas:

* fallback to plaintext
* integer sequences

# a better email

* tls only
* secure blob storage

# leveldb!

custom databases

# secure blob storage

use rsa public keys for one-way encryption to disk

threat model: seizing disks

weakness:

* disk access at hosting provider level, get private keys from disk and run MITM
with the certs

best:

* both sides using gpg

# content-addressable-blob-store

# rsa-stream

# hybrid-rsa-stream

# rsa-blob-store

# rsa-email-store

some hacks to get around how stupid imap is

