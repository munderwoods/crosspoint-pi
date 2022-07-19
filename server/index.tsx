const express = require("express");
const { exec } = require("child_process");
const fs = require('fs');
const bodyParser = require('body-parser')


const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

let config = {}
try {
  let rawdata = fs.readFileSync('./server/config.json');
  config = JSON.parse(rawdata);
  console.log(config)
} catch (error) {
  console.log(error)
}

app.get("/config", (req, res) => {
  if(config) {
    console.log(config)
    res.json({ data: config });
  } else {
    res.json({ message: "No config found" });
  }
});

app.put("/inputs", (req, res) => {
  config.inputAmount = req.body.inputAmount;
  fs.writeFileSync('./server/config.json', JSON.stringify(config));
  res.json(req.body);
});

app.put("/outputs", (req, res) => {
  config.outputAmount = req.body.outputAmount;
  fs.writeFileSync('./server/config.json', JSON.stringify(config));
  res.json(req.body);
});

app.post("/command", (req, res) => {
  console.log(req.body.command)
  exec(`echo '${req.body.command}' | picocom -rx 1000 /dev/ttyUSB0`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    const results = stdout.split("** read zero bytes from stdin **")[1].split("Terminating...")[0].split(/(\r\n|\n|\r)/gm).filter(x => !x.match(/(\r\n|\n|\r)/gm) && x !== '');
    console.log(`stdout: ${stdout}`);
    res.json({ results: results });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
