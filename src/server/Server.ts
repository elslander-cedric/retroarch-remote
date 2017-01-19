import { IncomingMessage, ServerResponse } from "http";
import * as http from "http";
import {Config} from "./Config";
import {RequestDispatcher} from "./RequestDispatcher";
import {GamesDbCachingService} from "./GamesDbCachingService";
import {LocalGamesDb} from "./LocalGamesDb";

export class Server {

  private server : http.Server;

  constructor() {};

  public start() : void {
    // TODO-FIXME: review needed
    console.log("starting server");
    let config : Config = new Config();

    let gamesDbCachingService : GamesDbCachingService = new GamesDbCachingService();
    gamesDbCachingService.init(config);

    let localGamesDb : LocalGamesDb = new LocalGamesDb();
    localGamesDb.init();

    let requestDispatcher : RequestDispatcher = new RequestDispatcher(localGamesDb, gamesDbCachingService);

    this.server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
      console.log("> [%s] - %s", request.method, request.url);

      if(request.method === 'OPTIONS') {
        response.statusCode = 200;
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length');
        response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        response.end();
      }

      if(request.method === 'GET' || request.method === 'POST') {
        requestDispatcher.dispatch(request, response);
      }
    });
    this.server.listen(1337);
  }

  public stop() :void {
    console.log("stopping server");
    this.server.close();
  }
}

new Server().start();
