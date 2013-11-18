var qs = require('querystring');

var getRawBody = require('raw-body');

var GifCanvas = require('../../lib/gif-canvas');

module.exports = function writeTextToConnections (req, res) {
  var firstConnections = req.firstConnections;
  var secondConnections = req.secondConnections;

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
    var gif = new GifCanvas();

    console.log('GET-FRAME: Fetching frame data');
    gif.getTextFrameData(query, function receiveTextFrameData (err, rawData) {
      console.log('GET-FRAME: Frame data fetched');

      if (err) {
        console.error(err);
        res.writeHead(500, {
          'content-type': 'text/plain'
        });
        return res.end('Error generating frame');
      }

      // Send a no content response
      res.writeHead(204);
      res.end();

      function writeToFirstConnections(buff) {
        firstConnections.forEach(function writeToFirstConnection (conn) {
          conn.res.write(buff);
        });
      }
      function writeToSecondConnections(buff) {
        secondConnections.forEach(function writeToSecondConnection (conn) {
          conn.res.write(buff);
        });
      }

      // Process the image (addFrame#1)
      console.log('ANALYZE: Analyzing image');
      // #GIFSOCKET-DIMENSIONS
      // TODO: Relocate this
      var width = 600;
      var height = 380;
      var pixels = new Uint8Array(width * height * 3);

      var count = 0;

      for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
          var b = (i * width * 4) + j * 4;
          pixels[count++] = rawData.charCodeAt(b);
          pixels[count++] = rawData.charCodeAt(b+1);
          pixels[count++] = rawData.charCodeAt(b+2);
        }
      }
      gif.setImagePixels(pixels);
      gif.analyzePixels();
      console.log('ANALYZE: Image analyzed');

      // Write out the image info for the first connections (addFrame#2)
      console.log('FIRST-INFO: Writing image info to first connections');
      gif.on('data', writeToFirstConnections);
      gif.writeImageInfo();
      gif.flushData();
      console.log('FIRST-INFO: First conections completed');

      // Write out the image info for the second connections (addFrame#2)
      console.log('SECOND-INFO: Writing image info to second connections');
      gif.removeListener('data', writeToFirstConnections);
      gif.on('data', writeToSecondConnections);
      gif.writeImageInfo();
      gif.flushData();
      console.log('SECOND-INFO: Second conections completed');

      // Write out the image itself for all connections (addFrame#3)
      console.log('IMAGE-ALL: Writing image to all connections');
      gif.on('data', writeToFirstConnections);
      gif.outputImage();
      gif.flushData();
      console.log('IMAGE-ALL: All connections completed');

      // Clean up event listeners
      gif.removeAllListeners();

      // TODO: On process close, write out finish to all connections

      // Move all firstConnections to secondConnections
      secondConnections.push.apply(secondConnections, firstConnections);
      firstConnections.splice(0, firstConnections.length);
    });
  });
};
