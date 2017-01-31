import {IncomingMessage,ServerResponse} from "http";
import { Url } from "url";
import * as url from 'url';

import {JsonRequestHandler} from "./JsonRequestHandler";
import {LocalGamesDb} from "./LocalGamesDb";

export class GameListRequestHandler extends JsonRequestHandler {
  private localGamesDb : LocalGamesDb;

  constructor(localGamesDb : LocalGamesDb) {
    super();
    this.localGamesDb = localGamesDb;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestUrl : Url = url.parse(request.url, true);
    let games = this.localGamesDb.getGames();

    response.statusCode = 200;
    response.write(JSON.stringify({ data: games }));

    this.postHandle(request, response);
  }
}
