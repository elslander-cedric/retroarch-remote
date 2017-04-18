
import * as httpProxy from 'http-proxy';
import * as url from 'url';

import { ClientRequest, IncomingMessage, ServerResponse } from 'http';

export class GiantBombProxy {
  private proxyServer;

  constructor() {
    this.proxyServer = httpProxy.createProxyServer({});

    this.proxyServer.on('proxyReq', function(
      proxyRequest: ClientRequest,
      request: IncomingMessage,
      response: ServerResponse,
      options) {});

    this.proxyServer.on('proxyRes', function (
      proxyResponse: ServerResponse,
      request: IncomingMessage,
      response: ServerResponse) {});
  }

  public proxy(request, response) : void {
    let ifModifiedSince = request.headers["if-modified-since"];

    if(ifModifiedSince) {
      response.statusCode = 304;
      response.end();
      return;
    }

    this.proxyServer.web(request, response, {
      target: `https://www.giantbomb.com${url.parse(request.url).pathname.replace('/giantbomb','')}`,
      ignorePath: true,
      secure: false
    });
  }
}
