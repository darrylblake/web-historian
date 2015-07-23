var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var parseUrl = require('url');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

// Todo: Get the root directory
// var topModule = module;
// while(topModule.parent)
//   topModule = topModule.parent;
// var appDir = path.dirname(topModule.filename);

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  var pathName = exports.getPathName(asset);
  var filePath;
  if (pathName === '/') filePath = archive.paths.siteAssets + '/index.html';
  else if (pathName.split('/')[1] === 'archive') {
    filePath = archive.paths.archivedSites + '/' + pathName.split('/')[2];
  }
  else filePath = archive.paths.siteAssets + pathName;

  // Try find file in /public
  fs.readFile(filePath, function (err, data) {
    if (err) callback('Not found!', 404);
    else callback(data, 200);
  });
};

exports.getPathName = function (req) {
  return parseUrl.parse(req.url).pathname;
};

exports.sendResponse = function (res, data, statusCode) {
  res.writeHead(statusCode, exports.headers);
  res.end(data);
};

exports.redirect = function(res, location) {
  exports.headers.location = location;
  res.writeHead(301, exports.headers);
  res.end();
}

// As you progress, keep thinking about what helper functions you can put here!
