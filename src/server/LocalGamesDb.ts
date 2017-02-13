// import { Observable } from 'rxjs/Observable';
import { Promise } from 'bluebird';
import { ChildProcess } from 'child_process';

import * as fs from 'fs';
import * as http from "http";
import * as unzip from 'unzip';
import * as request from 'request';
import * as path from 'path';
import * as child_process from 'child_process';
import * as bluebird from 'bluebird';

import { Game } from "./Game";
import { Config } from "./Config";

export class LocalGamesDb {
  private static fileEncoding = 'utf-8';

  private games : Array<Game> = [];
  private config : Config;
  private retroarch : ChildProcess;
  private kodi : ChildProcess;

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
    let pathGame = path.resolve(this.config.get("downloadDir"), `${game.id}`);

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
            //.pipe(unzip.Extract({ path: this.config.get('downloadDir') }))
            .pipe(unzip.Parse())
            .on('entry', function (entry) {
              var fileName = entry.path;
              var type = entry.type; // 'Directory' or 'File'
              var size = entry.size;
              if (type === "File") {
                entry.pipe(fs.createWriteStream(pathGame));
              } else {
                entry.autodrain();
              }
            })
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

  public stopGame(game : Game) : Promise<any|void> {
    console.log("stop game: %s", game.name);

    // if(!game.running) return Promise.reject("game was not running");

    return this.stopRetroArch()
      .delay(5000)
      .then(() => {
        console.log('stopping retroarch ok');
        this.startKodi();
      },(error) => {
        console.log('stopping reroarch error %s', error);
        this.startKodi();
      })
      .catch((e) => { console.log('catch kodi error %s', e); });
  }

  public launchGame(game : Game) : Promise<any|void> {
    console.log("launch game: %s", game.name);

    if(game.running) return Promise.reject("game was already running");

    return this.stopKodi()
      .delay(5000)
      .then(() => {
        console.log('stopping kodi ok');
        this.startRetroArch(game);
      },(error) => {
        console.log('stopping kodi error %s', error);
        this.startRetroArch(game);
      })
      .catch((e) => { console.log('catch kodi error %s', e); });
  }

  private startRetroArch(game : Game) : Promise<any|void> {
    let pathGame = path.resolve(this.config.get("downloadDir"), `${game.id}`);
    let command = `xinit /usr/bin/retroarch -L /usr/lib/libretro/nestopia_libretro.so ${pathGame}`;

    console.log('run %s', command);

    return new Promise((onSuccess, onError) => {
      // this.retroarch = child_process.exec(command, (error, stdout, stderr) => {
      //   if (error) {
      //     onError(`${error} - stderr: ${stderr}`);
      //   } else {
      //     onSuccess(`stdout: ${stdout}`);
      //   }
      // }).on('close', (code, signal) => {
      //   console.log(`retroarch terminated with code ${code} due to receipt of signal ${signal}`);
      // });

      this.retroarch = child_process.spawn('xinit', [
        '/usr/bin/retroarch',
        '-L', '/usr/lib/libretro/nestopia_libretro.so',
        pathGame], {stdio: "inherit"});

      // this.retroarch.stdout.on('data', (data) => {
      //   console.log(`retroarch stdout: ${data}`);
      // });
      //
      // this.retroarch.stderr.on('data', (data) => {
      //   console.log(`retroarch stderr: ${data}`);
      // });
      //
      // this.retroarch.on('close', (code) => {
      //   console.log(`retroarch exited with code ${code}`);
      // });

      onSuccess();
    });
  }

  private stopRetroArch() : Promise<any|void> {
    if(this.retroarch == null) {
      return Promise.reject("retroarch is not running");
    }

    return new Promise((onSuccess, onError) => {
      console.log("killing retroarch with pid: %s", this.retroarch.pid);
      this.retroarch.kill(); // will not kill children of my children
      this.retroarch = null;
      onSuccess();
    });
  }

  private startKodi() : Promise<any|void> {
    let command = `xinit /usr/bin/xbmc -nocursor :0`;

    console.log('run %s', command);

    return new Promise((onSuccess, onError) => {
      this.kodi = child_process.exec(command, (error, stdout, stderr) => {
        if (error) {
          onError(`${error} - stderr: ${stderr}`);
        } else {
          onSuccess(`stdout: ${stdout}`);
        }
      }).on('close', (code, signal) => {
        console.log(`kodi terminated with code ${code} due to receipt of signal ${signal}`);
      });
    });
  }

  private stopKodi() : Promise<any|void> {
    console.log('stopping kodi');

    return new Promise((onSuccess, onError) => {
      let options = {
        hostname: 'localhost',
        port: 8084,
        path: '/jsonrpc',
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
          'Content-Type': 'application/json'
        },
        auth: 'xbmc:xbmc'
      };

      let request = http.request(options, (response) => {
        response
        .on('data', () => {})
        .on('end', () => {
          console.log('stopping kodi ok');
          onSuccess();
        })
        .on('error', (e) => {
          console.log('stopping kodi error');
          onError(`problem with response: ${e.message}`);
        });

      }).on('error', (e) => {
        console.log('stopping kodi error');
        onError(`problem with request: ${e.message}`);
      })

      request.write(JSON.stringify({ jsonrpc: "2.0", method: "Application.Quit", id: 1} ));
      request.end();

    });
  }
}
