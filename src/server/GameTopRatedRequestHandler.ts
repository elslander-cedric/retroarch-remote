import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";
import * as url from 'url';

import {JsonRequestHandler} from "./JsonRequestHandler";
import {GamesDbCachingService} from "./GamesDbCachingService";

export class GameTopRatedRequestHandler extends JsonRequestHandler {
  private gamesDbCachingService : GamesDbCachingService;

  constructor(gamesDbCachingService : GamesDbCachingService) {
    super();
    this.gamesDbCachingService = gamesDbCachingService;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestUrl : Url = url.parse(request.url, true);
    let name = requestUrl.query['name'];

    let games = this.gamesDbCachingService.topRated((games) => {
      response.statusCode = 200;

      response.write(JSON.stringify({
        data: games.map(game => {
          return {
            id: game.id,
            name: game.name,
            platforms: game.platforms.map(platform => platform.name).join(', '),
            summary: game.deck,
            description: game.description,
            image: game.image ? game.image.icon_url : undefined
          }
        })
      }));

      this.postHandle(request, response);
    });
  }
}