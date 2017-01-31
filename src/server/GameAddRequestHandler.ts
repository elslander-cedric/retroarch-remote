import * as url from 'url';

import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";
import { JsonRequestHandler } from "./JsonRequestHandler";
import { Game } from "./Game";
import { LocalGamesDb } from "./LocalGamesDb";

export class GameAddRequestHandler extends JsonRequestHandler {
  private localGamesDb : LocalGamesDb;

  constructor(localGamesDb : LocalGamesDb) {
    super();
    this.localGamesDb = localGamesDb;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestBody = [];

    request
    .on('data', (chunk) => {
      requestBody.push(chunk);
    })
    .on('end', () => {
      let game : Game = JSON.parse(Buffer.concat(requestBody).toString());

      this.localGamesDb.addGame(game)
        .then((game: Game) => {
          response.statusCode = 200; // ok
          this.postHandle(request, response);
        }, (err) => {
          response.statusCode = 400; // bad request
          response.write(JSON.stringify({ errors: [err] }));
          this.postHandle(request, response);
        })
        .catch((err) => {
          response.statusCode = 500; // internal server error
          response.write(JSON.stringify({ errors: [err] }));
          this.postHandle(request, response);
        });
    })
    .on('error', (e) => {
      response.statusCode = 500; // internal server error
      response.write(JSON.stringify({ errors: [`problem with request: ${e.message}`] }));
      this.postHandle(request, response);
    });
  }
}
