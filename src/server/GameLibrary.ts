import * as fs from 'fs';

import { Game } from "./Game";

export class GameLibrary {
  private static fileEncoding = 'utf-8';

  private _games : Array<Game> = [];

  constructor() {};

  public init() : GameLibrary {
    const libraries = ['library.NES.json', 'library.N64.json'];

    libraries.forEach(library => fs.readFile(library, {
      encoding: GameLibrary.fileEncoding,
      flag: 'r+'
    }, (err, data) => {
      if (err) throw err;
      this._games = this._games.concat(JSON.parse(data));
    }));

    return this;
  }

  public lookup(id : number) : Game {
    return this._games.find(game => game.id === id);
  }

  public get games() : Array<Game> {
    return this._games;
  }
}
