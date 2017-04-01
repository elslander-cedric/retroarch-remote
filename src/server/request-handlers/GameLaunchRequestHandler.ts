import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";

import * as url from 'url';

import { JsonRequestHandler } from "./JsonRequestHandler";
import { Game } from "../Game";
import { GameTaskRunner } from "../GameTaskRunner";
import { GameRegistry } from "../GameRegistry";
import { GameLibrary } from "../GameLibrary";

export class GameLaunchRequestHandler extends JsonRequestHandler {
  private gameRegistry : GameRegistry;
  private gameLibrary : GameLibrary;
  private gameTaskRunner : GameTaskRunner;

  constructor(
    gameRegistry : GameRegistry,
    gameLibrary : GameLibrary,
    gameTaskRunner : GameTaskRunner) {
    super();
    this.gameRegistry = gameRegistry;
    this.gameLibrary = gameLibrary;
    this.gameTaskRunner = gameTaskRunner;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestUrl : Url = url.parse(request.url, true);
    let id = requestUrl.query['id'];
    let platform = requestUrl.query['platform'];
    let game : Game = this.gameLibrary.lookup(
      parseInt(id),
      parseInt(platform));

    this.gameTaskRunner.launch(game)
      .then((game: Game) => {
        this.gameRegistry.lookup(game.id, game.platform).running = true;
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
