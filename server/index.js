var express = require("express");
var exec = require("child_process").exec;
var fs = require('fs');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3001;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var config = {};
try {
    var rawdata = fs.readFileSync('./server/config.json');
    config = JSON.parse(rawdata);
    console.log(config);
}
catch (error) {
    console.log(error);
}
app.get("/config", function (req, res) {
    if (config) {
        console.log(config);
        res.json({ data: config });
    }
    else {
        res.json({ message: "No config found" });
    }
});
app.put("/inputs", function (req, res) {
    config.inputAmount = req.body.inputAmount;
    fs.writeFileSync('./server/config.json', JSON.stringify(config));
    res.json(req.body);
});
app.put("/outputs", function (req, res) {
    config.outputAmount = req.body.outputAmount;
    fs.writeFileSync('./server/config.json', JSON.stringify(config));
    res.json(req.body);
});
app.post("/command", function (req, res) {
    console.log(req.body.command);
    exec("echo '" + req.body.command + "' | picocom -rx 1000 /dev/ttyUSB0", function (error, stdout, stderr) {
        if (error) {
            console.log("error: " + error.message);
            return;
        }
        if (stderr) {
            console.log("stderr: " + stderr);
            return;
        }
        var results = stdout.split("** read zero bytes from stdin **")[1].split("Terminating...")[0].split(/(\r\n|\n|\r)/gm).filter(function (x) { return !x.match(/(\r\n|\n|\r)/gm) && x !== ''; });
        console.log("stdout: " + stdout);
        res.json({ results: results });
    });
});
app.listen(PORT, function () {
    console.log("Server listening on " + PORT);
});
