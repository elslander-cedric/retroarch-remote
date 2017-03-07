import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";

import * as url from 'url';

import { JsonRequestHandler } from "./JsonRequestHandler";
import { Game } from "../Game";
import { GameTaskRunner } from "../GameTaskRunner";

export class GameStopRequestHandler extends JsonRequestHandler {
  private gameTaskRunner : GameTaskRunner;

  constructor(gameTaskRunner : GameTaskRunner) {
    super();
    this.gameTaskRunner = gameTaskRunner;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestUrl : Url = url.parse(request.url, true);
    let id = requestUrl.query['id'];
    let game : Game = { id: parseInt(id) } as Game;

    this.gameTaskRunner.stop(game)
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