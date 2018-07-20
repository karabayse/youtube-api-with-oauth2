// Requires
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// Uses
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Get index file 
app.get('/*', function(req, res) {
  console.log('base url hit');
  res.sendFile(path.resolve('public/views/index.html'));
});

// Globals
var port = process.env.PORT || 7070;

// Spin up server
app.listen(port, function() {
  console.log('server up on:', port);
});
