import { IncomingMessage, ServerResponse } from "http";
import * as url from 'url';

import { RequestProcessor } from "./RequestProcessor";
import { FileRequestHandler } from "./FileRequestHandler";
import { GameListRequestHandler } from "./GameListRequestHandler";
import { GameTopRatedRequestHandler } from "./GameTopRatedRequestHandler";
import { GameDownloadRequestHandler } from "./GameDownloadRequestHandler";
import { GameLaunchRequestHandler } from "./GameLaunchRequestHandler";
import { GameStopRequestHandler } from "./GameStopRequestHandler";
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
      .addHandler('/', new FileRequestHandler())
      .addHandler('/games/list/', new GameListRequestHandler(localGamesDb))
      .addHandler('/games/top-rated/', new GameTopRatedRequestHandler(gamesDbCachingService))
      .addHandler('/games/download/', new GameDownloadRequestHandler(localGamesDb))
      .addHandler('/games/launch/', new GameLaunchRequestHandler(localGamesDb))
      .addHandler('/games/stop/', new GameStopRequestHandler(localGamesDb))
      .addHandler('/games/search/', new GameSearchRequestHandler(gamesDbCachingService))
      .addHandler('/games/add/', new GameAddRequestHandler(localGamesDb))
      .addHandler('/games/delete/', new GameDeleteRequestHandler(localGamesDb));
  };

  public dispatch(request: IncomingMessage, response: ServerResponse) {
    var pathname = url.parse(request.url).pathname;

    this.requestProcessor
      .getHandler(pathname)
      .handle(request, response);
  }
}
