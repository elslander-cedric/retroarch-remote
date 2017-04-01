import * as fs from 'fs';

import { Promise } from 'bluebird';
import { Subject } from 'rxjs/Subject';

import { Game } from "./Game";

export class GameRegistry {

  private static fileEncoding = 'utf-8';
  private static path = 'registry.json';

  private _games : Array<Game> = [];

  public notifier = new Subject<Game[]>();

  constructor() {};

  public init() : GameRegistry {
    let that = this;

    fs.exists(GameRegistry.path, function(exists) {
      fs.readFile(GameRegistry.path, {
        encoding: GameRegistry.fileEncoding,
        flag: exists ? 'r+' : 'w+'
      }, (err, data) => {
        if (err) throw err;
        that._games = JSON.parse(data || '[]');
      });
    });

    return this;
  }

  public write() : Promise<any|void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        GameRegistry.path,
        JSON.stringify(this._games),
        { encoding: GameRegistry.fileEncoding, flag: 'w' },
        (err) => {
          if (err) {
            reject(`write error: ${err}`)
          } else {
            this.notifier.next(this._games);
            resolve(`write ok`);
          }
        }
      );
    });
  }

  public update(game : Game) : Promise<any|void> {
    let _game : Game = this._games.find(__game => __game.id === game.id);

    for(let property in game) {
        if (game.hasOwnProperty(property)) {
            _game[property] = game[property];
        }
    }

    return this.write();
  }

  public add(game : Game) : Promise<any|void> {
    if(this._games.find(_game => _game.id === game.id)) {
      return Promise.reject("game already in list");
    }

    this._games.push(game);
    return this.write();
  }

  public remove(game : Game) : Promise<any|void> {
    this._games = this._games.filter(_game => _game.id !== game.id);
    return this.write();
  }

  public lookup(id : number, platform ?: number) : Game {
    return this._games.find(game => {
      return game.id === id && (platform ? game.platform === platform : true);
    });
  }

  get games() : Array<Game> {
    return this._games;
  }
}
