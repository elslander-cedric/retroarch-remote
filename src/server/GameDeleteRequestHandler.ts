import {IncomingMessage,ServerResponse} from "http";
import { Url } from "url";
import * as url from 'url';

import {JsonRequestHandler} from "./JsonRequestHandler";
import {Game} from "./Game";
import {LocalGamesDb} from "./LocalGamesDb";

export class GameDeleteRequestHandler extends JsonRequestHandler {

  private localGamesDb : LocalGamesDb;

  constructor(localGamesDb : LocalGamesDb) {
    super();
    this.localGamesDb = localGamesDb;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    let requestUrl : Url = url.parse(request.url, true);
    let id = requestUrl.query['id'];
    console.log("remove game with id:", id);

    this.localGamesDb.deleteGame(id);

    response.writeHead(200, {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    response.end();
  }
}
