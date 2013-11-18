exports.openImage = function openImage (req, res) {
  console.log('CONNECTION-ADDED');
  res.writeHead(200, {
    'connection': 'keep-alive',
    'content-type': 'image/gif',
    'transfer-encoding': 'chunked'
  });
  // TODO: Use writeHeader and not a hack
  // gif.writeHeader();
  // DEV: It would be nice to write out image info here too (e.g. width x height)
  res.write(new Buffer('GIF89a', 'utf8'));

  req.firstConnections.push({
    res: res
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
