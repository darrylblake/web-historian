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

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  
  pathName = exports.getPathName(asset);
  if (pathName === '/') {
    pathName = '/index.html'
  }

  // Check in /web/public
  fs.readFile(archive.paths.siteAssets + pathName, function(err, data) {
    if (err) {
      // Check in /archives/sites if doesn't in /web/public
      fs.readFile(archive.paths.archivedSites + pathName, function(err, data) {
        // If archive doesn't yet exist
        if (err) {
          archive.addUrlToList(pathName.substr(1));
          exports.sendRedirect(res, '/loading.html');
        // Return archived website
        } else {
          exports.sendResponse(res, data, 200);
        }
      });
    // Return static file in /web/public
    } else {
      exports.sendResponse(res, data, 200);
    }
  });
};

exports.getPathName = function (req) {
  return parseUrl.parse(req.url).pathname;
};

exports.sendResponse = function (res, data, statusCode) {
  res.writeHead(statusCode, exports.headers);
  res.end(data);
};

exports.sendRedirect = function(res, location) {
  exports.headers.location = location;
  res.writeHead(302, exports.headers);
  res.end();
}

// As you progress, keep thinking about what helper functions you can put here!
