import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";

import * as url from 'url';

import { JsonRequestHandler } from "./JsonRequestHandler";
import { Game } from "./Game";
import { LocalGamesDb } from "./LocalGamesDb";

export class GameStopRequestHandler extends JsonRequestHandler {
  private localGamesDb : LocalGamesDb;

  constructor(localGamesDb : LocalGamesDb) {
    super();
    this.localGamesDb = localGamesDb;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestUrl : Url = url.parse(request.url, true);
    let id = requestUrl.query['id'];
    let game : Game = this.localGamesDb.getGame(parseInt(id));

    this.localGamesDb.stopGame(game)
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
  }
}
