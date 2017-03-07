import * as url from 'url';

import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";
import { JsonRequestHandler } from "./JsonRequestHandler";
import { Game } from "../Game";
import { GameRegistry } from "../GameRegistry";

export class GameAddRequestHandler extends JsonRequestHandler {
  private gameRegistry : GameRegistry;

  constructor(gameRegistry : GameRegistry) {
    super();
    this.gameRegistry = gameRegistry;
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

      this.gameRegistry.addFavorite(game)
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
