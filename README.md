# gifsockets-server

GIFSockets are never-ending animated [GIFs][GIF] for sending text and images between people.

Demo: http://console-log.2013.nodeknockout.com/

`gifsockets-server` is a reimplementation of [videlalvaro/gifsockets][]. It was written in [Clojure][] and not trivial to set up, especially without any [Clojure][] experience.

This projet is written in [JavaScript][] and use [gif-encoder][] for encoding and [PhantomJS][] for [canvas][] preparation.

[videlalvaro/gifsockets]: https://github.com/videlalvaro/gifsockets
[Clojure]: http://en.wikipedia.org/wiki/Clojure
[GIF]: http://en.wikipedia.org/wiki/Graphics_Interchange_Format
[JavaScript]: http://en.wikipedia.org/wiki/ECMAScript
[gif.js]: http://jnordberg.github.io/gif.js/
[PhantomJS]: http://phantomjs.org/
[canvas]: https://developer.mozilla.org/en-US/docs/HTML/Canvas

To run this website locally:

```bash
npm install -g gifsockets-server phantomjs-pixel-server
phantomjs-pixel-server &
gifsocket-server
# Website will be available at http://localhost:8000/
```

## Documentation
This code was written during [Node Knockout 2013][], a 48 hour hackathon, but it is slowly being organized.

[Node Knockout 2013]: http://2013.nodeknockout.com/

The server you are running is at `server/app.js` and the `gif` logic is inside of `lib`.

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Unlicense
As of Nov 10 2013, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
