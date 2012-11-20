var airwaves = require("airwaves");
var bbc = new airwaves.Channel();

var disconnectUser = function(session) {
    // TODO destroy all user information
    // Do not destroy session ?
    session.username = false;
};

var connectUser = function(username, session) {
    disconnectUser(session);
    // TODO Set initial data for new user
    session.username = username;
};

exports.index = function(req, res) {
    res.render("index");
};

// exports.test = function(req, res) {
//     res.render("test");
// };

exports.send = function(req, res) {
    if (!req.sess.hasOwnProperty("username")) {
        res.send({"success": false, "msg": "Must be authenticated."});
        return;
    }
    if (!req.query.hasOwnProperty("msg")) {
        res.send({"success": false, "msg": "Not enough parameters."});
        return;
    }
    bbc.broadcast("news", {"from": req.sess.username, "msg": req.query.msg});
    res.send({"success": true});
};

var getReturnFunction = function(res) {
    return function(msg) {
        res.send(msg);
    };
};

exports.receive = function(req, res) {
    if (!req.sess.hasOwnProperty("username")) {
        res.send({"success": false, "msg": "Must be authenticated."});
        return;
    }
    req.sess.sub_func = getReturnFunction(res);
    // If connexion is closed, tel message module to remove event
    req.on("close", function() {
        console.log("Connexion lost for : " + req.sess.username + ".");
        console.log("Unsubscribe for : " + req.sess.username);
        bbc.unsubscribe("news", req.sess.sub_func);
    });

    // set callback for incoming messages
    console.log("Subscribe for : " + req.sess.username);
    bbc.subscribe("news", req.sess.sub_func);
};

exports.connect = function(req, res) {
    connectUser(req.query.username, req.sess);
    res.send({"success": true});
};

exports.disconnect = function(req, res) {
    console.log("Connexion closed for : " + req.sess.username + ".");
    console.log("Unsubscribe for : " + req.sess.username);
    bbc.unsubscribe("news", req.sess.sub_func);
    req.sess.sub_func(null);
    disconnectUser(req.sess);
    res.send({"success": true});
};

// exports.info = function(req, res) {
//     res.send({
//         "session": req.session,
//         "sess": req.sess
//     });
// };

// exports.msg_info = function(req, res) {
//     res.send("Not implemented.");
// };
