import {IncomingMessage,ServerResponse} from "http";
import { Url } from "url";
import * as url from 'url';

import { JsonRequestHandler } from "./JsonRequestHandler";
import { GameRegistry } from "../GameRegistry";

export class GameListRequestHandler extends JsonRequestHandler {
  private gameRegistry : GameRegistry;

  constructor(gameRegistry : GameRegistry) {
    super();
    this.gameRegistry = gameRegistry;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestUrl : Url = url.parse(request.url, true);
    let games = this.gameRegistry.games;

    response.statusCode = 200;
    response.write(JSON.stringify({ data: games }));

    this.postHandle(request, response);
  }
}
