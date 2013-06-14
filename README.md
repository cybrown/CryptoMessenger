CryptoMessenger
===============

Javascript crypted messenger webapp

#FAQ
* What browsre can I use ?

Chrome and Firefow, Safari should work and IE > 9.
Should work on webkit based mobile devices, and firefox mobile.

* How are data encrypted ?

The application uses AES directly in the *browser* (via crypto.js).

* Why not use HTTPS instead of in browser encryption ?

With HTTPS, the server knows what data are transfered.
Here the messages are crypted by the browser and send as is to the other browser, no one can intercept information on an untrusty server.

#Installation:
* Get sources (git or archive).
* Run `npm install` in source folder to download the dependencies.

#Node.js dependencies:
* Express: The request router for the http server.
* Jade: Simple template engine.
* Airwaves: Simple pub/sub implementation.

#Client side dependencies:
* jQuery.
* crypto.js: The library used to encrypt the messages with AES 256bits.
* twitter boostrap: UI library.

#Usage:

Run `node app.js`

Use a web browser to port 8888.

#Future:
* Private conversation channels.
* RSA for assymetric encryption.