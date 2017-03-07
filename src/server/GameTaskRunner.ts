import * as path from 'path';
import * as fs from 'fs';
import * as request from 'request';
import * as unzip from 'unzip';

import { Promise } from 'bluebird';

import { Game } from './Game';
import { Config } from './Config';
import { KodiRPCCommandExecutor } from './kodi/KodiRPCCommandExecutor';
import { RetroArchLauncher } from './retroarch/RetroArchLauncher';
import { KodiLauncher } from './kodi/KodiLauncher';
import { ProcessExecution } from './ProcessExecution';

export class GameTaskRunner {
  private config : Config;
  private kodiRPCCommandExecutor : KodiRPCCommandExecutor;
  private retroArchLauncher : RetroArchLauncher;
  private kodiLauncher : KodiLauncher;

  private retroArchProcessExecution : ProcessExecution;

  constructor(
    config : Config,
    retroArchLauncher : RetroArchLauncher,
    kodiLauncher : KodiLauncher,
    kodiRPCCommandExecutor : KodiRPCCommandExecutor) {
    this.config = config;
    this.retroArchLauncher = retroArchLauncher;
    this.kodiLauncher = kodiLauncher;
    this.kodiRPCCommandExecutor = kodiRPCCommandExecutor;
  }

  public launch(game : Game) : Promise<any|void> {
    const retroArchArgs = [
      '-L', '/usr/lib/libretro/nestopia_libretro.so',
      path.resolve(this.config.get("downloadDir"), `${game.id}`)
    ];

    return this.kodiRPCCommandExecutor.stop()
      .delay(2000)
      .then(() => this.retroArchProcessExecution && this.retroArchProcessExecution.stop())
      .then(() => this.retroArchProcessExecution = this.retroArchLauncher.launch(retroArchArgs))
      .catch((err) => { console.error(`launch error: ${err}`); });
  }

  public stop(game : Game) : Promise<any|void> {
    return this.retroArchProcessExecution && this.retroArchProcessExecution.stop()
      .then(() => this.retroArchProcessExecution = undefined)
      .then(() => this.kodiLauncher.launch())
      .catch((err) => { console.error(`stop error: ${err}`); });
  }

  public download(game : Game) : Promise<string|void> {
    const pathGame = path.resolve(this.config.get("downloadDir"), `${game.id}`);
    const pathArchive = pathGame + '.zip';

    if(fs.existsSync(pathGame)) return Promise.reject("game was already downloaded");

    return new Promise((resolve, reject) => {
      request
        .get(game.downloadUrl)
        .on('error', (err) => reject(`could not download archive: ${err}`))
        .pipe(fs.createWriteStream(pathArchive, { flags: 'w+' }))
        .on('finish', () => {
          this.extract(pathArchive)
            .then(() => this.removeArchive(pathArchive))
            .then(() => resolve("download ok"))
            .catch((err) => reject(`download error: ${err}`));
        });
    });
  }

  private extract(path : string) : Promise<string> {
    return new Promise((resolve, reject) => {
      fs.createReadStream(path)
        .on('error', (err) => { reject(`could not read archive: ${err}`) })
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
          if (entry.type === "File") {
            entry.pipe(fs.createWriteStream(path.slice(0,-4)));
          } else {
            entry.autodrain();
          }
        })
        .on('finish', () => resolve(`archive extracted`));
    });
  }

  private removeArchive(path : string) : Promise<string> {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
          if(err) {
            reject(`could not remove archive: ${err}`);
          } else {
            resolve(`archive removed`);
          }
        });
    });
  }
}