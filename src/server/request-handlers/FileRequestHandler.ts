import { IncomingMessage, ServerResponse } from "http";

import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import * as mime from 'mime';

import { RequestHandler } from "./RequestHandler";

export class FileRequestHandler implements RequestHandler {

  constructor() {};

  public preHandle(request: IncomingMessage, response: ServerResponse): void {
    let uri = url.parse(request.url).pathname;

    // TODO-FIXME: index.html is visible in browser url with this :(
    if (uri === '/') { // redirect to /index.html
      response.writeHead(302, { 'Location': '/index.html' });
      response.end();
    }
  }

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    if(response.finished) { return; }

    let uri = url.parse(request.url).pathname;
    let filename = path.join(process.cwd(), uri);

    fs.exists(filename, function(exists) {
        response.statusCode = exists ? 200 : 404;

        if(exists){
          // TODO-FIXME: should first check supported encodings by client
          fs.exists(filename + '.gz', function(exists) {
            if(exists) {
              filename += '.gz';
              response.setHeader('Content-Encoding', 'gzip');
            }

            let lastModified = fs.statSync(filename).mtime;

            response.setHeader('Content-Type', mime.lookup(filename));
            response.setHeader("Last-Modified", lastModified.toUTCString());

            let ifModifiedSince = request.headers["if-modified-since"];

            if(ifModifiedSince) {
              if(Math.floor(new Date(ifModifiedSince).getTime()/1000) === Math.floor(lastModified.getTime()/1000)){
                response.statusCode = 304;
              }
            }

            fs.createReadStream(filename).pipe(response);
          });
        } else {
          response.end();
        }
    });
  }

  public postHandle(request: IncomingMessage, response: ServerResponse): void {}
}
