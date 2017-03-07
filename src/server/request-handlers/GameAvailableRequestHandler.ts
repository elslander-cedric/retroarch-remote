import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";
import * as url from 'url';
import { Observable } from 'rxjs/Rx';
import { knuthShuffle } from 'knuth-shuffle';

import { JsonRequestHandler } from "./JsonRequestHandler";
import { GameLibrary } from "../GameLibrary";
import { GiantBombAPIService } from "../giantbomb/GiantBombAPIService";
import { Game } from "../Game";

export class GameAvailableRequestHandler extends JsonRequestHandler {
  private gameLibrary : GameLibrary;
  private GiantBombAPIService : GiantBombAPIService;

  constructor(
    gameLibrary : GameLibrary,
    GiantBombAPIService : GiantBombAPIService) {
    super();
    this.gameLibrary = gameLibrary;
    this.GiantBombAPIService = GiantBombAPIService;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestUrl : Url = url.parse(request.url, true);
    let offset = requestUrl.query['offset'];
    let limit = requestUrl.query['limit'];

    if(parseInt(offset) === 0) {
      knuthShuffle(this.gameLibrary.games);
    }

    let dwnlGames : Array<Game> =
      this.gameLibrary.games.slice(offset, parseInt(offset) + parseInt(limit));

    Observable.from(dwnlGames.map((game : Game) => game.id))
      .concatMap((id : number) => this.GiantBombAPIService.searchById(id))
      .reduce((acc: Game[], value: Game[]) => acc.concat(value))
      .toPromise()
      .then((games : Game []) => {
        response.statusCode = 200;
        response.write(JSON.stringify({ data: games }));
        this.postHandle(request, response);
      });
  }
}
