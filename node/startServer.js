const express = require('express')
const app = express()
const path = require("path")
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname + "/../")))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/../index.html'));
})

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`)
})