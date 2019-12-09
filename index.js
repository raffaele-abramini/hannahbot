const webhook = require("./src/webhook");

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.use(express.json())

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.post("/hannah-bot", (req, res) => {
  webhook(req.body);
  res.send("Thsnks")
});