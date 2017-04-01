import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";

import * as url from 'url';

import { JsonRequestHandler } from "./JsonRequestHandler";
import { Game } from "../Game";
import { GameRegistry } from "../GameRegistry";

export class GameDeleteRequestHandler extends JsonRequestHandler {
  private gameRegistry : GameRegistry;

  constructor(gameRegistry : GameRegistry) {
    super();
    this.gameRegistry = gameRegistry;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestUrl : Url = url.parse(request.url, true);
    let id = requestUrl.query['id'];
    let game : Game = this.gameRegistry.lookup(parseInt(id));

    this.gameRegistry.remove(game)
      .then((game: Game) => {
        response.statusCode = 200; // ok
        this.postHandle(request, response);
      })
      .catch((err) => {
        response.statusCode = 500; // internal server error
        response.write(JSON.stringify({ errors: [err] }));
        this.postHandle(request, response);
      });
  }
}
