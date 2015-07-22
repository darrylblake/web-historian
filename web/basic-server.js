var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");
var helpers = require('./http-helpers.js');

// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
initialize();

var port = 3000;
var ip = "127.0.0.1";
// var server = http.createServer(handler.handleRequest);

var routes = {
  '/': function(req, res){
    helpers.serveAssets(res, 'index.html', function(data, statusCode) {
      helpers.sendResponse(res, data, statusCode);
    });
  }
};

var server = http.createServer(function (req, res) {
  // console.log("Serving request type " + req.method + " for url " + req.url);
  var path = helpers.getPathName(req);
  var route = routes[path];
  if (route) route(req, res);
  else helpers.sendResponse(res, 'Not found!', 404);
});

if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip);
  console.log("Listening on http://" + ip + ":" + port);
}


