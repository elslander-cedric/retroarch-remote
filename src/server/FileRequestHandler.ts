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

    var pathname = url.parse(request.url).pathname;

    if (pathname === '/') { pathname = '/index.html'; }

    // TODO-FIXME
    console.log(path.resolve(__dirname, pathname));
    pathname = pathname.slice(1);
    fs.readFile(pathname, {}, (err, data) => {
    // fs.readFile(path.resolve(__dirname, pathname), {}, (err, data) => {
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
