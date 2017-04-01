import * as fs from 'fs';

import { Game } from "./Game";
import { Platform } from "./Platform";

export class GameLibrary {
  private static fileEncoding = 'utf-8';

  private _games : Array<Game> = [];

  constructor() {};

  public init() : GameLibrary {
    const libraries = [
      { platform: Platform.NES, file: 'library.NES.json'},
      { platform: Platform.N64, file: 'library.N64.json'}];

    libraries.forEach(library => fs.readFile(library.file, {
      encoding: GameLibrary.fileEncoding,
      flag: 'r+'
    }, (err, data) => {
      if (err) throw err;

      this._games = this._games.concat(JSON.parse(data).map(game => {
        game.platform = library.platform;
        return game;
      }));
    }));

    return this;
  }

  public lookup(id : number, platform ?: number) : Game {
    return this._games.find(game => {
      return game.id === id && (platform ? game.platform === platform : true);
    });
  }

  public get games() : Array<Game> {
    return this._games;
  }
}
