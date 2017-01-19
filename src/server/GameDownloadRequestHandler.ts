import {IncomingMessage,ServerResponse} from "http";
import { Url } from "url";
import * as url from 'url';
import * as fs from 'fs';
import * as http from "http";
import * as unzip from 'unzip';
import * as request from 'request';

import {JsonRequestHandler} from "./JsonRequestHandler";
import {GamesDbCachingService} from "./GamesDbCachingService";
import {Game} from "./Game";
import {LocalGamesDb} from "./LocalGamesDb";

export class GameDownloadRequestHandler extends JsonRequestHandler {

  private downloadDir = "/home/cedric/Downloads/";
  private localGamesDb : LocalGamesDb;

  constructor(localGamesDb : LocalGamesDb) {
    super();
    this.localGamesDb = localGamesDb;
  };

  public extract(game : Game) : void {

  }

  public download(id : number, callback) : void {
    const baseUrlNESGames = "http://archive.org/download/No-Intro-Collection_2013-06-14/No-Intro-Collection_2013-06-14.zip/Nintendo%20-%20Nintendo%20Entertainment%20System%2F";

    let pathArchive = this.downloadDir + id + ".zip";
    let pathGame = this.downloadDir + id + ".nes";
    let archiveFile = fs.createWriteStream(pathArchive);
    let gameDownloadPath = this.localGamesDb.getGameDownloadPath(id);


    if(gameDownloadPath) {
      console.log("downloading ...");
      request
        .get(`${baseUrlNESGames}${gameDownloadPath}`)
        .on('error', (err) => {
          console.error(err)
        })
        .pipe(archiveFile)
        .on('finish', () => {
          console.log("game downloaded");

          console.log("extracting ...");
          fs.createReadStream(pathArchive)
            .pipe(unzip.Extract({ path: pathGame }))
            .on('finish', () => {
              console.log("game extracted");
              callback(true);
            });
        });
    } else {
      console.log("no matching download file :(");
      callback(false);
    }
  }

  public handle(request: IncomingMessage, response: ServerResponse): void {
    let requestUrl: Url = url.parse(request.url, true);
    var id = requestUrl.query['id'];

    console.log("download game with id:", id);

    this.download(parseInt(id), (downloaded) => {
      response.statusCode = downloaded ? 200 : 404;
      response.setHeader('Content-Type', 'text/html');
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      response.end();
    });
  }
}
