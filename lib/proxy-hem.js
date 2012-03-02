(function() {
  var BACKENDS, Hem, ProxyHem, argv, getBackendForRequest, httpProxy, optimist;

  httpProxy = require('http-proxy');

  Hem = require('hem');

  optimist = require('optimist');

  argv = optimist.alias('p', 'port').argv;

  BACKENDS = {
    HEM: {
      host: 'localhost',
      port: process.env.PORT || argv.port || 9294
    },
    API: {
      host: 'localhost',
      port: 4000,
      https: true
    }
  };

  getBackendForRequest = function(req) {
    var rgx, staticContentTypes, type, _i, _len;
    staticContentTypes = ['js', 'css', 'png', 'gif', 'ico'];
    if (req.url === '/' || /^\/lib/.test(req.url) || /^\/images/.test(req.url)) {
      return BACKENDS.HEM;
    }
    for (_i = 0, _len = staticContentTypes.length; _i < _len; _i++) {
      type = staticContentTypes[_i];
      rgx = new RegExp("\." + type);
      if (rgx.test(req.url)) return BACKENDS.HEM;
    }
    return BACKENDS.API;
  };

  ProxyHem = {
    exec: function() {
      var hem, proxyServer;
      hem = Hem.exec("server", {
        port: BACKENDS.HEM.port
      });
      proxyServer = httpProxy.createServer(function(req, res, proxy) {
        var backend;
        backend = getBackendForRequest(req);
        return proxy.proxyRequest(req, res, backend);
      });
      return proxyServer.listen(3000, function() {
        var addr, be, _results;
        addr = proxyServer.address();
        console.log("[proxy-hem] listening on http://" + addr.address + ":" + addr.port);
        _results = [];
        for (be in BACKENDS) {
          _results.push(console.log("[" + be + "] running on http(s)://" + BACKENDS[be].host + ":" + BACKENDS[be].port));
        }
        return _results;
      });
    }
  };

  module.exports = ProxyHem;

}).call(this);
