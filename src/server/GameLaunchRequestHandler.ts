import {IncomingMessage,ServerResponse} from "http";
import { Url } from "url";
import * as url from 'url';

import {JsonRequestHandler} from "./JsonRequestHandler";
import {Game} from "./Game";
import {LocalGamesDb} from "./LocalGamesDb";

export class GameLaunchRequestHandler extends JsonRequestHandler {

  private localGamesDb : LocalGamesDb;

  constructor(localGamesDb : LocalGamesDb) {
    super();

    this.localGamesDb = localGamesDb;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    let requestUrl : Url = url.parse(request.url, true);
    let pathname : string = requestUrl.pathname;
    let games : Array<Game> = this.localGamesDb.getGames();

    var gameId = requestUrl.query['id'];

    console.log("launch game with id:", gameId);
    console.log("search for game in:", games);

    games.filter((game) => { return game.id === parseInt(gameId); })[0].launch();

    response.writeHead(200, {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    response.end();

  }
}
