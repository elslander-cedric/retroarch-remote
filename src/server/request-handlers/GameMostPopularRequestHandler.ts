import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";
import * as url from 'url';

import { JsonRequestHandler } from "./JsonRequestHandler";
import { GiantBombAPIService } from "../giantbomb/GiantBombAPIService";
import { Game } from "../Game";
export class GameMostPopularRequestHandler extends JsonRequestHandler {
  private GiantBombAPIService : GiantBombAPIService;

  constructor(GiantBombAPIService : GiantBombAPIService) {
    super();
    this.GiantBombAPIService = GiantBombAPIService;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestUrl : Url = url.parse(request.url, true);
    let offset = requestUrl.query['offset'];
    let limit = requestUrl.query['limit'];

    this.GiantBombAPIService.mostPopular(offset, limit)
      .toPromise()
      .then((games : Game []) => {
        response.statusCode = 200;
        response.write(JSON.stringify({ data: games }));
        this.postHandle(request, response);
      });
  }
}
