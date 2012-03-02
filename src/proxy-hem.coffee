httpProxy = require 'http-proxy'
Hem = require 'hem'
optimist = require 'optimist'

argv = optimist.alias('p', 'port').argv

BACKENDS = 
	HEM: 
		host: 'localhost'
		port: process.env.PORT or argv.port or 9294
	API:
		host: 'localhost'
		port: 4000
		https: true

	
getBackendForRequest = (req) ->
	staticContentTypes = ['js','css','png','gif','ico']

	if req.url is '/' or /^\/lib/.test(req.url) or /^\/images/.test(req.url)
		return BACKENDS.HEM

	for type in staticContentTypes
		rgx = new RegExp "\.#{type}"
		if rgx.test req.url then return BACKENDS.HEM

	return BACKENDS.API

		
# TODO
# add configuration options to specify either on commandline or in external file
# where the API server is running
#
# also, add option for Websocket server

ProxyHem = 
	
	exec: ->
		hem = Hem.exec "server", port: BACKENDS.HEM.port

		proxyServer = httpProxy.createServer (req, res, proxy) ->
			backend = getBackendForRequest req
			proxy.proxyRequest req, res, backend

		proxyServer.listen 3000, ->
			addr = proxyServer.address()
			console.log "[proxy-hem] listening on http://#{addr.address}:#{addr.port}"
			for be of BACKENDS
				console.log "[#{be}] running on http(s)://#{BACKENDS[be].host}:#{BACKENDS[be].port}"

module.exports = ProxyHem
