import { IncomingMessage, ServerResponse } from "http";

import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import * as mime from 'mime';

import { RequestHandler } from "./RequestHandler";

export class FileRequestHandler implements RequestHandler {

  constructor() {};

  public preHandle(request: IncomingMessage, response: ServerResponse): void {}

  public handle(request: IncomingMessage, response: ServerResponse): void {
    var uri = url.parse(request.url).pathname;

    if (uri === '/') { // defaults to /index.html
      // uri = '/index.html';

      response.writeHead(302, {
        'Location': '/index.html'
      });
      response.end();
      return;
    }

    let filename = path.join(process.cwd(), uri);
    fs.exists(filename, function(exists) {
        response.statusCode = exists ? 200 : 404;
        response.setHeader('Content-Type', mime.lookup(filename));

        if(exists){
          fs.createReadStream(filename).pipe(response);
        } else {
          response.end();
        }
    });
  }

  public postHandle(request: IncomingMessage, response: ServerResponse): void {}
}
