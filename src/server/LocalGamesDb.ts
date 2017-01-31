// import { Observable } from 'rxjs/Observable';
import { Promise } from 'bluebird';

import * as fs from 'fs';
import * as http from "http";
import * as unzip from 'unzip';
import * as request from 'request';
import * as path from 'path';
import * as child_process from  'child_process';

import { Game } from "./Game";
import { Config } from "./Config";

export class LocalGamesDb {
  private static fileEncoding = 'utf-8';

  private games : Array<Game> = [];
  private config : Config;

  constructor(config : Config) {
    this.config = config;
  };

  public init() : LocalGamesDb {
    let gamesDbPath = this.config.get('gamesDbPath');

    fs.readFile(gamesDbPath, {
      encoding: LocalGamesDb.fileEncoding,
      flag: 'r+'
    }, (err, data) => {
      if (err) throw err;
      this.games = JSON.parse(data);
    });

    return this;
  }

  public save() : Promise<any|void> {
    return new Promise((onSuccess, onError) => {
      fs.writeFile(this.config.get('gamesDbPath'), JSON.stringify(this.games), { encoding: LocalGamesDb.fileEncoding, flag: 'w' }, (err) => {
        if (err) throw err;
        onSuccess();
      });
    });
  }

  public getGame(id : number) : Game {
    return this.games.filter((game) => game.id === id)[0];
  }

  public getGames() : Array<Game> {
    return this.games;
  }

  public addGame(game: Game) : Promise<any|void> {
    console.log("add game: %s", game.name);
    if(this.games.filter((_game) => _game.id === game.id).length >0) return Promise.reject("game already in list");
    this.games.push(game);
    return this.save();
  }

  public deleteGame(game : Game) : Promise<any|void> {
    console.log("delete game: %s", game.name);
    this.games = this.games.filter(_game => _game.id !== game.id);
    return this.save();
  }

  public downloadGame(game : Game) : Promise<Game|any> {
    console.log("download game: %s", game.name);

    let pathArchive = path.resolve(this.config.get("downloadDir"), `${game.id}.zip`);
    let _game = this.config.get('downloadUrls').find(_game => _game.id === game.id);

    if(game.downloaded) return Promise.reject("game was already downloaded");
    if(!_game) return Promise.reject("no download available for that game");

    return new Promise((onSuccess, onError) => {
      request
        .get(_game.downloadUrl)
        .on('error', (err) => { onError(err) })
        .pipe(fs.createWriteStream(pathArchive, { flags: 'w+' }))
        .on('finish', () => {
          console.log("game downloaded, extracting ...");

          fs.createReadStream(pathArchive)
            .on('error', (err) => { onError(err) })
            .pipe(unzip.Extract({ path: this.config.get('downloadDir') }))
            .on('finish', () => {
              console.log("game extracted");
              game.downloaded = true;

              fs.unlink(pathArchive, (err) => {
                if(err) {
                  onError("could not remove archive");
                } else {
                  onSuccess(game);
                }
              });
            });
        });
    });
  }

  public launchGame(game : Game) : Promise<any|void> {
    console.log("launch game: %s", game.name);

    let pathGame = path.resolve(this.config.get("downloadDir"), `${game.name}.nes`);
    let command = `/usr/bin/retroarch -L /usr/lib/libretro.so ${pathGame}`;

    return new Promise((onSuccess, onError) => {
      child_process.exec(command, (error, stdout, stderr) => {
        if (error) throw error;
        onSuccess(`stdout: ${stdout}`);
      });
    });
  }
}
