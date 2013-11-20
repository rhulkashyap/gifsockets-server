var qs = require('querystring');

var getRawBody = require('raw-body');

module.exports = function writeTextToConnections (req, res) {
  // Parse in the body (up to 1mb)
  console.log('JSON-BODY-PARSE: Parsing body');
  getRawBody(req, {
    expected: req.headers['content-length'],
    limit: 10 * 1024 * 1024 // 1 mb
  }, function (err, buffer) {
    console.log('JSON-BODY-PARSE: Body parsed');
    // If there was an error (e.g. bad length, over length), respond poorly
    if (err) {
      res.writeHead(500, {
        'content-type': 'text/plain'
      });
      return res.end('Content was too long');
    }

    // Break up form submission
    var dataStr = buffer.toString();
    var imageData = JSON.parse(dataStr);

    // Write out our JSON to all connections
    // TODO: Move this from drawRgba frame to drawRgb with string decoding
    console.log('JSON-Outputting: ');
    req.gifsocket.writeRgbaFrame(imageData, function wroteJsonFrame () {
      // Send a no content response
      res.writeHead(204);
      res.end();
    });
  });
};
