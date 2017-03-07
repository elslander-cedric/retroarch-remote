import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";

import * as url from 'url';

import { JsonRequestHandler } from "./JsonRequestHandler";
import { Game } from "../Game";
import { GameTaskRunner } from "../GameTaskRunner";
import { GameLibrary } from "../GameLibrary";

export class GameDownloadRequestHandler extends JsonRequestHandler {
  private gameLibrary : GameLibrary;
  private gameTaskRunner : GameTaskRunner;

  constructor(gameLibrary : GameLibrary, gameTaskRunner : GameTaskRunner) {
    super();
    this.gameLibrary = gameLibrary;
    this.gameTaskRunner = gameTaskRunner;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestUrl : Url = url.parse(request.url, true);
    let id = requestUrl.query['id'];
    let game : Game = this.gameLibrary.lookup(parseInt(id));

    if(game) {
      this.gameTaskRunner.download(game)
        .then(() => {
          response.statusCode = 200; // ok
          this.postHandle(request, response);
        })
        .catch((err) => {
          response.statusCode = 500; // internal server error
          response.write(JSON.stringify({ errors: [err] }));
          this.postHandle(request, response);
        });
    } else {
      response.statusCode = 404;
      response.statusMessage = "no download available for that game";
      this.postHandle(request, response);
    }
  }
}
