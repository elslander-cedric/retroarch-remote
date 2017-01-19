import {IncomingMessage,ServerResponse} from "http";
import { Url } from "url";
import * as url from 'url';

import {JsonRequestHandler} from "./JsonRequestHandler";
import {GamesDbCachingService} from "./GamesDbCachingService";

export class GameSearchRequestHandler extends JsonRequestHandler {

  private gamesDbCachingService : GamesDbCachingService;

  constructor(gamesDbCachingService : GamesDbCachingService) {
    super();

    this.gamesDbCachingService = gamesDbCachingService;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    let requestUrl : Url = url.parse(request.url, true);
    let name = requestUrl.query['name'];

    console.log("search games for:", name);
    let games = this.gamesDbCachingService.search(name, (games) => {
      console.log("returning %s games", games.length);

      response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      });


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

      response.end();
    });

  }
}
