#Because Hem is awesome but missing one thing...

When playing around with [SpineJS](http://spinejs.com) I also discovered [Hem](https://github.com/maccman/hem).  I immediately loved it and really wanted to use it with all my projects, everything I build for work and home is coffeescript and stylus.  The only thing missing was built in support for the models to make ajax calls to an API or CRUD server.  That's where proxy-hem comes in.  Proxy-hem really only does one thing, it runs hem and it runs http-proxy.  All requests for static content: images, stylesheets, javascript, etc... are directed to Hem.  Everything else is passed through to the default server.

#Installation

npm install -g proxy-hem

#Usage

Proxy-hem should be run from the directory where the slug.json file exists.  You can specify a port for Hem to use using -p.  Otherwise, the only Hem command used is 'server'.

The API server is expected to be running at https://localhost:4000.  Configuration for this is coming soon.

For Hem usage, see [Hem guide](http://spinejs.com/docs/hem)
