import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";
import * as url from 'url';

import { JsonRequestHandler } from "./JsonRequestHandler";
import { GamesDbCachingService } from "./GamesDbCachingService";
import { Game } from "./Game";

export class GameSearchRequestHandler extends JsonRequestHandler {
  private gamesDbCachingService : GamesDbCachingService;

  constructor(gamesDbCachingService : GamesDbCachingService) {
    super();
    this.gamesDbCachingService = gamesDbCachingService;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestUrl : Url = url.parse(request.url, true);
    let name = requestUrl.query['name'];

    this.gamesDbCachingService.searchByName(name)
      .toPromise()
      .then((games : Game []) => {
        response.statusCode = 200;
        response.write(JSON.stringify({ data: games }));
        this.postHandle(request, response);
      });
  }
}
