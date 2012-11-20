var crypto = require("crypto");

var sessions = {};
var current = {};

var random_int = function() {
    return crypto.randomBytes(4).readUInt32BE(0);
};

exports.get = function(session) {
    // If no id cookie, create one
    if (!session.hasOwnProperty("id")) {
        // create new session id
        var sess_id;
        do {
            sess_id = random_int();
        } while (session.hasOwnProperty(sess_id));
        session.id = sess_id;
    }
    // If no session container, create one
    if (!sessions.hasOwnProperty(session.id))
        sessions[session.id] = {};
    // Return session container
    return sessions[session.id];
};

exports.cur = function() {
    return current;
};
