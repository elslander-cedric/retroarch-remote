import { IncomingMessage, ServerResponse } from "http";
import * as url from 'url';

import { RequestProcessor } from "./RequestProcessor";
import { GiantBombAPIService } from "./giantbomb/GiantBombAPIService";
import { RetroArchUDPCommandExecutor } from "./retroarch/RetroArchUDPCommandExecutor";
import { GameRegistry } from "./GameRegistry";
import { GameLibrary } from "./GameLibrary";
import { GameTaskRunner } from "./GameTaskRunner";
import { Config } from "./Config";

import { FileRequestHandler } from "./request-handlers/FileRequestHandler";
import { GameListRequestHandler } from "./request-handlers/GameListRequestHandler";
import { GameAvailableRequestHandler } from "./request-handlers/GameAvailableRequestHandler";
import { GameMostPopularRequestHandler } from "./request-handlers/GameMostPopularRequestHandler";
import { GameDownloadRequestHandler } from "./request-handlers/GameDownloadRequestHandler";
import { GameLaunchRequestHandler } from "./request-handlers/GameLaunchRequestHandler";
import { GameStopRequestHandler } from "./request-handlers/GameStopRequestHandler";
import { GameSearchRequestHandler } from "./request-handlers/GameSearchRequestHandler";
import { GameAddRequestHandler } from "./request-handlers/GameAddRequestHandler";
import { GameUpdateRequestHandler } from "./request-handlers/GameUpdateRequestHandler";
import { GameDeleteRequestHandler } from "./request-handlers/GameDeleteRequestHandler";
import { RetroArchCommandRequestHandler } from "./request-handlers/RetroArchCommandRequestHandler"

export class RequestDispatcher {
  private requestProcessor : RequestProcessor;

  constructor(
    gameRegistry : GameRegistry,
    gameLibrary : GameLibrary,
    gameTaskRunner : GameTaskRunner,
    giantBombAPIService : GiantBombAPIService,
    retroArchUDPCommandExecutor : RetroArchUDPCommandExecutor) {
    this.requestProcessor = new RequestProcessor()
      .addHandler('/', new FileRequestHandler())
      .addHandler('/games/list/', new GameListRequestHandler(gameRegistry))
      .addHandler('/games/most-popular/', new GameMostPopularRequestHandler(giantBombAPIService))
      .addHandler('/games/available/', new GameAvailableRequestHandler(gameLibrary, giantBombAPIService))
      .addHandler('/games/download/', new GameDownloadRequestHandler(gameLibrary, gameTaskRunner))
      .addHandler('/games/launch/', new GameLaunchRequestHandler(gameTaskRunner))
      .addHandler('/games/stop/', new GameStopRequestHandler(gameTaskRunner))
      .addHandler('/games/search/', new GameSearchRequestHandler(giantBombAPIService))
      .addHandler('/games/add/', new GameAddRequestHandler(gameRegistry))
      .addHandler('/games/update/', new GameUpdateRequestHandler(gameRegistry))
      .addHandler('/games/delete/', new GameDeleteRequestHandler(gameRegistry))
      .addHandler('/retroarch/', new RetroArchCommandRequestHandler(retroArchUDPCommandExecutor));
  };

  public dispatch(request: IncomingMessage, response: ServerResponse) {
    let pathname = url.parse(request.url).pathname;

    this.requestProcessor
      .getHandler(pathname)
      .handle(request, response);
  }
}
