import * as fs from 'fs';

import { Promise } from 'bluebird';

import { Game } from "./Game";

export class GameRegistry {

  private static fileEncoding = 'utf-8';
  private static path = 'registry.json';

  private games : Array<Game> = [];

  constructor() {};

  public init() : GameRegistry {
    let that = this;

    fs.exists(GameRegistry.path, function(exists) {
      fs.readFile(GameRegistry.path, {
        encoding: GameRegistry.fileEncoding,
        flag: exists ? 'r+' : 'w+'
      }, (err, data) => {
        if (err) throw err;
        that.games = JSON.parse(data || '[]');
      });
    });

    return this;
  }

  public save() : Promise<any|void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        GameRegistry.path,
        JSON.stringify(this.games),
        { encoding: GameRegistry.fileEncoding, flag: 'w' },
        (err) => {
          if (err) {
            reject(`save error: ${err}`)
          } else {
            resolve(`save ok`);
          }
        }
      );
    });
  }

  public addFavorite(game : Game) : Promise<any|void> {
    if(this.games.find(_game => _game.id === game.id)) {
      return Promise.reject("game already in list");
    }

    this.games.push(game);
    return this.save();
  }

  public removeFavorite(game : Game) : Promise<any|void> {
    this.games = this.games.filter(_game => _game.id !== game.id);
    return this.save();
  }

  public getFavorite(id : number) : Game {
    return this.games.find(game => game.id === id);
  }

  public getFavorites() : Array<Game> {
    return this.games;
  }
}
