'use strict';

var express = require('express');
var app = express();

app.use(express.static('./'));
app.use('/ui-kit-icd', express.static('./ui-kit.html'));
app.use('/search', express.static('./search-profile.html'));
/*app.get('/', function (req, res) {
   res.send('Hello World');
})*/

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})