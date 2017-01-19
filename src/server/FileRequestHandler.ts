import {IncomingMessage,ServerResponse} from "http";
import {RequestHandler} from "./RequestHandler";
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

export class FileRequestHandler implements RequestHandler {

  private rootDir = '../../dist';

  public handle(request: IncomingMessage, response: ServerResponse): void {
    var pathname = url.parse(request.url).pathname;

    if (pathname === '/') {
      pathname = '/index.html';
    }

    fs.readFile(path.resolve(__dirname, this.rootDir + pathname), function (err, data) {
      if (err) {
        console.log(err);
        response.writeHead(404, {
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        response.write(data.toString());
      }

      response.end();
    });
  }
}
