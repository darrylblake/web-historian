var http = require('http');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, "utf8", function (err, data) {
    if (err) throw err;
    // callback(JSON.parse(data));
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(listOfUrls) {
    callback(_.contains(listOfUrls, url));
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url  + '\n', function (err) {
    callback && callback();
  });
};

exports.isUrlArchived = function(url, callback){
  fs.open(path.join(exports.paths.archivedSites, url), 'r', function(err) {
    if (err) callback(false);
    else callback(true);
  });

};

exports.downloadUrls = function(listOfUrls){
  listOfUrls.forEach(function (url) {
    downloadUrl(url);
  });
};

function downloadUrl(url) {
  http.get('http://' + url, function(http_res) {
    var html = '';
    http_res.on('data', function (chunk) {
      html += chunk;
    });
    var filePath = path.join(exports.paths.archivedSites, url);
    http_res.on('end', function () {
      fs.writeFile(filePath, html);
    });
  }).on('error', function(err) {
    console.log(err);
  });
};
