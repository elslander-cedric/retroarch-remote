import { IncomingMessage, ServerResponse } from "http";
import * as url from 'url';

import { RequestProcessor } from "./RequestProcessor";
import { FileRequestHandler } from "./FileRequestHandler";
import { GameListRequestHandler } from "./GameListRequestHandler";
import { GameDownloadRequestHandler } from "./GameDownloadRequestHandler";
import { GameLaunchRequestHandler } from "./GameLaunchRequestHandler";
import { GameSearchRequestHandler } from "./GameSearchRequestHandler";
import { GameAddRequestHandler } from "./GameAddRequestHandler";
import { GameDeleteRequestHandler } from "./GameDeleteRequestHandler";
import { GamesDbCachingService } from "./GamesDbCachingService";
import { LocalGamesDb } from "./LocalGamesDb";
import { Config } from "./Config";

export class RequestDispatcher {
  private requestProcessor : RequestProcessor;

  constructor(localGamesDb : LocalGamesDb, gamesDbCachingService : GamesDbCachingService) {
    this.requestProcessor = new RequestProcessor()
      .addHandler('/games/list/', new GameListRequestHandler(localGamesDb))
      .addHandler('/games/download/', new GameDownloadRequestHandler(localGamesDb))
      .addHandler('/games/launch/', new GameLaunchRequestHandler(localGamesDb))
      .addHandler('/games/search/', new GameSearchRequestHandler(gamesDbCachingService))
      .addHandler('/games/add/', new GameAddRequestHandler(localGamesDb))
      .addHandler('/games/delete/', new GameDeleteRequestHandler(localGamesDb))
      .addHandler('/', new FileRequestHandler());
  };

  public dispatch(request: IncomingMessage, response: ServerResponse) {
    var pathname = url.parse(request.url).pathname;

    console.log("dispatch ", pathname);

    this.requestProcessor
      .getHandler(pathname)
      .handle(request, response);
  }
}
