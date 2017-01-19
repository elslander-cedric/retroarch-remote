import {IncomingMessage,ServerResponse} from "http";
import { Url } from "url";
import * as url from 'url';

import {JsonRequestHandler} from "./JsonRequestHandler";
import {Game} from "./Game";
import {LocalGamesDb} from "./LocalGamesDb";

export class GameAddRequestHandler extends JsonRequestHandler {

  private localGamesDb : LocalGamesDb;

  constructor(localGamesDb : LocalGamesDb) {
    super();
    this.localGamesDb = localGamesDb;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    let requestUrl : Url = url.parse(request.url, true);
    let pathname : string = requestUrl.pathname;

    let requestBody = [];

    request
    .on('data', (chunk) => {
      console.log(`REQUEST BODY CHUNK RECEIVED`);
      requestBody.push(chunk);
    })
    .on('end', () => {
      console.log(`REQUEST BODY END`);
      let jsonRequest = JSON.parse(Buffer.concat(requestBody).toString());
      let game : Game = jsonRequest;

      this.localGamesDb.addGame(game);
    })
    .on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
    });

    response.writeHead(200, {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    response.end();
  }
}
