import { IncomingMessage, ServerResponse } from "http";

import * as http from "http";

import { Config } from "./Config";
import { GameRegistry } from "./GameRegistry";
import { GameLibrary } from "./GameLibrary";
import { GameTaskRunner } from "./GameTaskRunner";
import { KodiRPCCommandExecutor } from './kodi/KodiRPCCommandExecutor';
import { RetroArchLauncher } from './retroarch/RetroArchLauncher';
import { KodiLauncher } from './kodi/KodiLauncher';
import { RequestDispatcher } from "./RequestDispatcher";
import { GiantBombAPIService } from "./giantbomb/GiantBombAPIService";

export class Server {
  private server : http.Server;

  constructor() {};

  public start() : void {
    console.log("starting server ...");

    let config : Config = new Config().init();

    let requestDispatcher : RequestDispatcher = new RequestDispatcher(
      new GameRegistry().init(),
      new GameLibrary().init(),
      new GameTaskRunner(config,
        new RetroArchLauncher(),
        new KodiLauncher(),
        new KodiRPCCommandExecutor()),
      new GiantBombAPIService(config));

    this.server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
      console.log("[%s] - %s", request.method, request.url);

      // common http headers
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length');
      response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

      if(request.method === 'OPTIONS') {
        response.statusCode = 200;
        response.end();
      }

      if(request.method === 'GET' || request.method === 'POST') {
        requestDispatcher.dispatch(request, response);
      }
    });

    this.server.listen(1337);
    console.log("server listening");
  }

  public stop() :void {
    console.log("stopping server ...");
    this.server.close();
  }
}

new Server().start();
