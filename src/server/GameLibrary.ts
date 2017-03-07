import * as fs from 'fs';

import { Game } from "./Game";

export class GameLibrary {
  private static fileEncoding = 'utf-8';

  private _games : Array<Game> = [];

  constructor() {};

  public init() : GameLibrary {
    fs.readFile('library.json', {
      encoding: GameLibrary.fileEncoding,
      flag: 'r+'
    }, (err, data) => {
      if (err) throw err;
      this._games = JSON.parse(data);
    });

    return this;
  }

  public lookup(id : number) : Game {
    return this._games.find(game => game.id === id);
  }

  public get games() : Array<Game> {
    return this._games;
  }
}
