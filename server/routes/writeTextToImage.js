var qs = require('querystring');

var getRawBody = require('raw-body');

var TextCanvas = require('../../lib/text-canvas');

module.exports = function writeTextToConnections (req, res) {
  // Parse in the body (up to 1mb)
  console.log('BODY-PARSE: Parsing body');
  getRawBody(req, {
    expected: req.headers['content-length'],
    limit: 1 * 1024 * 1024 // 1 mb
  }, function (err, buffer) {
    console.log('BODY-PARSE: Body parsed');
    // If there was an error (e.g. bad length, over length), respond poorly
    if (err) {
      res.writeHead(500, {
        'content-type': 'text/plain'
      });
      return res.end('Content was too long');
    }

    // Break up form submission
    var queryStr = buffer.toString();
    var query = qs.parse(queryStr);
    var text = query.text;

    if (text === undefined) {
      res.writeHead(500, {
        'content-type': 'text/plain'
      });
      return res.end('Missing "text" parameter');
    }

    // Write out our text to all connections
    console.log('Outputting: ' + text);

    // Generate a new GIF to encode
    var textCanvas = new TextCanvas();

    console.log('GET-FRAME: Fetching frame data');
    textCanvas.getTextFrameData(query, function receiveTextFrameData (err, rawData) {
      console.log('GET-FRAME: Frame data fetched');

      if (err) {
        console.error(err);
        res.writeHead(500, {
          'content-type': 'text/plain'
        });
        return res.end('Error generating frame');
      }

      var rgbPixels = textCanvas.decodeStringImage(rawData);
      req.gifsocket.writeRgbFrame(rgbPixels, function wroteTextFrame () {
        // Send a no content response
        res.writeHead(204);
        res.end();
      });
    });
  });
};
