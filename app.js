var express = require("express");
var ctrl = require("./controllers");
var sess = require("./session");
var jade = require("jade");

var app = express();

var config = {
    "dir": {
        "static": __dirname + "/www",
        "views": __dirname + "/views"
    }
};

app.set("views", config.dir.views);
app.set("view engine", "jade");

app.engine("jade", jade.__express);

app.use(express.favicon());
app.use(express.cookieParser('rdgthujdt-y'));
app.use(express.cookieSession());

app.use(function(req, res, next) {
    req.sess = sess.get(req.session);
    next();
})

var require_authentication = function(req, res, next) {
    if (!req.sess.hasOwnProperty("username")) {
        res.send(401, {"success": false, "msg": "Must be authenticated."});
    }
    else {
        next();
    }
};

app.use("/send", require_authentication);
app.use("/receive", require_authentication);

app.get("/", ctrl.index);
app.get("/send", ctrl.send);
app.get("/receive", ctrl.receive);
app.get("/connect", ctrl.connect);
app.get("/disconnect", ctrl.disconnect);
app.get("/info", ctrl.info);
app.get("/msg_info", ctrl.msg_info);
// app.get("/test", ctrl.test);

app.use(express.static(config.dir.static));

app.listen(8888);
console.log("Listening...");
