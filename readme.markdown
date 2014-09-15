# modular email

substack.net

---

# how email works

* smtp
* imap

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

# smtp-protocol with blob storage

``` js
var smtp = require('smtp-protocol');

var server = smtp.createServer(function (req) {
    req.on('message', function (stream, ack) {
        console.log('from: ' + req.from);
        console.log('to: ' + req.to);
        
        // we can use a content-addressable blob store here!
        
        ack.accept();
    });
});
server.listen(5025);
```

---

# smtp-protocol with blob storage

``` js
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
```

---

# leveldb

``` js
var level = require('level');
```

---

# leveldb

``` js
var level = require('level');
var db = level('/tmp/blah');
```

---

# leveldb

* db.get()
* db.put()
* db.del()
* db.batch()
* db.createReadStream()

---

# bytewise

* null
* false
* true
* Number (numeric)
* Date (numeric, epoch offset)
* Buffer (bitwise)
* String (lexicographic)
* Set (componentwise with elements sorted)
* Array (componentwise)
* Object (componentwise string-keyed key/value pairs)
* Map (componentwise key/value pairs)
* RegExp (stringified lexicographic)
* Function (stringified lexicographic)
* undefined

---

# bytewise

* null
* Number (numeric)
* String (lexicographic)
* Array (componentwise)
* undefined

---

# sublevel

leveldb inside a leveldb

---

# leveldb to store email!

associate each blob hash with a mailbox address and time stamp

---

# smtp-protocol with blob storage and leveldb

``` js
var smtp = require('smtp-protocol');
var blob = require('content-addressable-blob-store');
var store = blob({ path: './blobs' });

var server = smtp.createServer(function (req) {
    req.on('message', function (stream, ack) {
        console.log('from: ' + req.from);
        console.log('to: ' + req.to);
        
        var w = store.createWriteStream();
        stream.pipe(w);
        
        // we can index the hash here
        
        ack.accept();
    });
});
server.listen(5025);
```

---

# smtp-protocol with blob storage and leveldb

``` js
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
```

---

# modularize!

``` js
var smtp = require('smtp-protocol');
var maildb = require('maildb');

var db = require('level')('./db');
var mbox = maildb(db, { dir: './blobs' });

var server = smtp.createServer(function (req) {
    req.on('message', function (stream, ack) {
        console.log('from: ' + req.from);
        console.log('to: ' + req.to);
        
        stream.pipe(mail.save(req.from, req.to));
        ack.accept();
    });
});
server.listen(5025);
```

---

# imap

horrors

---

# imap

most of the super tricky indexing encapsulated into maildb

---

# secure blob storage!

fallback for when not using gpg

---

# rsa-stream

asymmetric crypto

n/8-11 bits max

---

# hybrid-rsa-stream

asymmetrically encrypt a random key,

followed by a symmetric cipher

safe for > n/8-11 bits

---

# rsa-blob-store

wrap content-addressable-blob-store
  with hybrid-rsa-stream

---

# eelmail!

* eelmail
* maildb
* level
* content-addressable-blob-store
* bytewise
* smtp-protocol
* imap-parser
* rsa-stream
* hybrid-rsa-stream

