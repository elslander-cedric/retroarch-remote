require("../../library.NES.json");
require("../../library.N64.json");

import { IncomingMessage, ServerResponse } from "http";

import * as http from "http";
import * as url from 'url';

import { Config } from "./Config";
import { GameRegistry } from "./GameRegistry";
import { GameLibrary } from "./GameLibrary";
import { GameTaskRunner } from "./GameTaskRunner";
import { KodiRPCCommandExecutor } from './kodi/KodiRPCCommandExecutor';
import { RetroArchLauncher } from './retroarch/RetroArchLauncher';
import { RetroArchUDPCommandExecutor } from './retroarch/RetroArchUDPCommandExecutor';
import { KodiLauncher } from './kodi/KodiLauncher';
import { RequestDispatcher } from "./RequestDispatcher";
import { GiantBombAPIService } from "./giantbomb/GiantBombAPIService";
import { WebsocketServer } from './WebsocketServer';
import { GiantBombProxy } from  './giantbomb/GiantBombProxy';

export class Server {
  private server : http.Server;

  constructor() {};

  public start() : void {
    console.log("starting http server ...");

    let config : Config = new Config().init();

    let requestDispatcher : RequestDispatcher = new RequestDispatcher(
      new GameRegistry().init(),
      new GameLibrary().init(),
      new GameTaskRunner(config,
        new RetroArchLauncher(),
        new KodiLauncher(),
        new KodiRPCCommandExecutor(config)),
      new GiantBombAPIService(config),
      new RetroArchUDPCommandExecutor(config));

    let giantBombProxy = new GiantBombProxy();

    this.server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
      console.log("[%s] - %s", request.method, request.url);

      if(url.parse(request.url).pathname.startsWith('/giantbomb')) {
        giantBombProxy.proxy(request, response)
        return;
      }

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

    //TODO-FIXME: put this somewhere else
    new WebsocketServer(
      this.server,
      new GameRegistry().init(),
      new GameLibrary().init(),
      new GameTaskRunner(config,
        new RetroArchLauncher(),
        new KodiLauncher(),
        new KodiRPCCommandExecutor(config))
    ).start();

    this.server.listen(config.get("port"));
    console.log("http server listening");
  }

  public stop() :void {
    console.log("stopping server ...");
    this.server.close();
  }
}

new Server().start();
