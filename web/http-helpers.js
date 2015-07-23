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

exports.serveAssets = function(res, req, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  var pathName = exports.getPathName(req);
  var filePath = archive.paths.siteAssets + '/';
  if (pathName === '/') filePath += 'index.html';
  else if (pathName === '/styles.css') {
    filePath += 'styles.css';
    filePath = path.join(archive.paths.archivedSites, pathName);
  }
  else {
    var url = pathName.substr(1);
    // If it is in sites.txt
    archive.isUrlInList(url, function(exists) {
      // If it's in /archives/sites
      if (exists) {
        archive.isUrlArchived(url, function (exists) {
          if (exists) {
            console.log(archive.paths.archivedSites + pathName);

            fs.readFile(archive.paths.archivedSites + pathName, function (err, data) {
              if (err) callback('Not found!', 404);
              else callback(data, 200);
            });

            // archive.retrieveFile(archive.paths.archivedSite + pathName, function(data) {
            //   callback(res, data, 200);
            // });
          }
        });
      // Archive doesn't yet exist...
      } else {
        archive.addUrlToList(url);
        exports.redirect(res, archive.paths.siteAssets + '/loading.html');
      }
    })
    archive.addUrlToList(pathName.substr(1))
  }

  // callback(res, 'Not Found!', 404);

  // fs.open(path.join(filePath, 'r', function(err) {
  //   if (err) {
  //     filePath = archive.paths.archivedSites + '/';
  //     fs.open(path.join(filePath, 'r', function(err) {
  //       if (err) // return 404
  //       else {
  //       }
  //     }  
  //   }
  // });

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
  res.writeHead(302, exports.headers);
  res.end();
}

// As you progress, keep thinking about what helper functions you can put here!
