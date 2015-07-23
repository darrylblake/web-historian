var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// require more modules/folders here!

var actions = {  
  'GET': function(req, res) {
    helpers.serveAssets(res, req, function(data, statusCode) {
      helpers.sendResponse(res, data, statusCode);
    });
  },
  'POST': function (req, res) {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      // Todo: This can't be right.
      var location = '/archive/' + body.split('=')[1];
      helpers.redirect(res, location);
    });
  }
}

exports.handleRequest = function (req, res) {
  actions[req.method](req, res);
  // res.end(archive.paths.list);
};
