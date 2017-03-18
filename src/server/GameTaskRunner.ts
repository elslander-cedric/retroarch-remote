import * as path from 'path';
import * as fs from 'fs';
import * as request from 'request';
import * as unzip from 'unzip';

import { Promise } from 'bluebird';

import { Game } from './Game';
import { Platform } from "./Platform";
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
  private kodiProcessExecution : ProcessExecution;

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
    let emulator = '/usr/lib/libretro/';

    switch(game.platform) {
        case Platform.NES:
          emulator += 'nestopia_libretro.so';
          break;
        case Platform.N64:
          emulator += 'mupen64plus_libretro.so';
    }

    const retroArchArgs = [
      '-L',
      emulator,
      path.resolve(this.config.get("downloadDir"), `${game.id}`)
    ];

    // TODO-FIXME: check if config('kodi') === true
    return this.download(game)
      .then((result) => console.log(`game downloaded ok: ${result}`))
      .catch((err) => console.error(`game downloaded error: ${err}`))
      .then(() => this.kodiRPCCommandExecutor.stop())
      .then((result) => console.log(`kodi stop ok: ${result}`))
      .delay(3000)
      .catch((err) => console.error(`kodi stop error: ${err}`))
      .then(() => {
        console.log(`try to stop retroarch`);
        return this.retroArchProcessExecution.stop();
      })
      .then((result) => console.log(`retroarch stop ok: ${result}`))
      .catch((err) => console.error(`retroarch stop error: ${err}`))
      .delay(1000)
      .then(() => {
        console.log(`try to start retroarch`);
        return this.retroArchLauncher.launch(retroArchArgs);
      })
      .then((retroArchProcessExecution: ProcessExecution) => {
        console.log(`retroarch was started, pid: ${retroArchProcessExecution.pid()}`);
        this.retroArchProcessExecution = retroArchProcessExecution;
        return this.retroArchProcessExecution;
      })
      .catch((err) => console.error(`retroarch launch error: ${err}`));

  }

  public stop(game : Game) : Promise<any|void> {
    // TODO-FIXME: to be tested
    // TODO-FIXME: check if config('kodi') === true
    const kodiArgs = ['/usr/bin/xbmc', '-nocursor', ':0'];

    return Promise
      .try(() => {
        console.log(`try to stop retroarch`);
        return this.retroArchProcessExecution.stop();
      })
      .then((result) => console.log(`retroarch stop result: ${result}`))
      .catch((err) => console.error(`retroarch stop error: ${err}`))
      .delay(1000)
      .then(() => {
        console.log(`try to launch kodi`);
        return this.kodiLauncher.launch(kodiArgs);
      })
      .then((kodiProcessExecution: ProcessExecution) => {
          console.log(`kodi was started`);
          this.kodiProcessExecution = kodiProcessExecution;
          return this.kodiProcessExecution;
      })
      .catch((err) => console.error(`kodi launch error: ${err}`));
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
