import { IncomingMessage, ServerResponse } from "http";

import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

import { RequestHandler } from "./RequestHandler";

export class FileRequestHandler implements RequestHandler {

  constructor() {};

  public preHandle(request: IncomingMessage, response: ServerResponse): void {
    response.setHeader('Content-Type', 'text/html');
  }

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let pathname = url.parse(request.url).pathname;

    if (pathname === '/') { // defaults to /index.html
      pathname = '/index.html';
    }

    /*    
    if (pathname === '/') { // redirect to /index.html
      response.writeHead(302, {
        'Location': '/index.html'
      });
      this.postHandle(request, response);
      return;
    }
    */

    pathname = pathname.slice(1); // omit leading '/'

    fs.readFile(pathname, {}, (err, data) => {
      response.statusCode = err ? 404 : 200;

      if (err) {
        response.statusMessage = err.message;
      } else {
        response.write(data.toString());
      }

      this.postHandle(request, response);
    });
  }

  public postHandle(request: IncomingMessage, response: ServerResponse): void {
    response.end();
  }
}
