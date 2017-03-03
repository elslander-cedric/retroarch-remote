import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";
import * as url from 'url';
import { Observable } from 'rxjs/Rx';

import { JsonRequestHandler } from "./JsonRequestHandler";
import { LocalGamesDb } from "./LocalGamesDb";
import { GamesDbCachingService } from "./GamesDbCachingService";
import { Game } from "./Game";

export class GameAvailableRequestHandler extends JsonRequestHandler {
  private localGamesDb : LocalGamesDb;
  private gamesDbCachingService : GamesDbCachingService;

  constructor(
    localGamesDb : LocalGamesDb,
    gamesDbCachingService : GamesDbCachingService) {
    super();
    this.localGamesDb = localGamesDb;
    this.gamesDbCachingService = gamesDbCachingService;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestUrl : Url = url.parse(request.url, true);
    let offset = requestUrl.query['offset'];
    let limit = requestUrl.query['limit'];

    let dwnlGames : Array<Game> =
      this.localGamesDb
        .getDownloadableGames()
          .slice(offset, parseInt(offset) + parseInt(limit));

    Observable.from(dwnlGames.map((game : Game) => game.id))
      .concatMap((id : number) => this.gamesDbCachingService.searchById(id))
      .reduce((acc: Game[], value: Game[]) => acc.concat(value))
      .toPromise()
      .then((games : Game []) => {
        response.statusCode = 200;
        response.write(JSON.stringify({ data: games }));
        this.postHandle(request, response);
      });
  }
}
