const express = require('express');
const cors = require('cors');
const fs = require('fs');
const data = require('./output.json');
const app = express();
const port = 3000;

app.use(cors({
	origin: '*'
}))

app.get('/get', (req, res) => {
  res.header("Content-Type",'application/json');
  res.send(JSON.parse(fs.readFileSync('output.json')));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
