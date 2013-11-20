exports.openImage = function openImage (req, res) {
  console.log('CONNECTION-ADDED');
  res.writeHead(200, {
    'connection': 'keep-alive',
    'content-type': 'image/gif',
    'transfer-encoding': 'chunked'
  });

  // Add a listener (and write data to it magically)
  req.gifsocket.addListener(res);
};

exports.closeImages = function (req, res) {
  // Close all connections via gifsocket
  req.gifsocket.closeAll(function allSocketsClosed () {
    res.send(204);
  });
};

exports.writeTextToImage = require('./writeTextToImage');
exports.writeJsonToImage = require('./writeJsonToImage');

// Render some jade into memory
var fs = require('fs');
var jade = require('jade');
function renderView(filepath, locals) {
  var file = fs.readFileSync(filepath, 'utf8');
  return jade.render(file, locals);
}

var indexHtml = renderView(__dirname + '/../../views/index.jade', {});
exports.index = function (req, res) {
  res.send(indexHtml);
};

var pageNotFoundHtml = renderView(__dirname + '/../../views/404.jade', {});
exports[404] = function (req, res) {
  res.status(404);
  res.send(pageNotFoundHtml);
};
