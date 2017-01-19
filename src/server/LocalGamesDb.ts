import {Game} from "./Game";

import * as fs from 'fs';

export class LocalGamesDb {

  private localFilePath = '/home/cedric/Downloads/games.json';
  private localFileDownloadPath = '/home/cedric/Downloads/games_nes.json';

  private games : Array<Game>;

  constructor() {};

  public init() : void {
    this.loadFromFile(this.localFilePath);
  }

  public loadFromFile(path : string) : void {
    this.games = JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  public saveToFile(path : string) : void {
    fs.writeFileSync(this.localFilePath, JSON.stringify(this.games));
  }

  public getGameDownloadPath(id : number) : string {
     let games = JSON.parse(
       fs.readFileSync(this.localFileDownloadPath, 'utf8')
     ).filter(game => game.id === id);

     return games[0] ? games[0].file : undefined;
  }

  public addGame(game: Game) : void {
    console.log("add game: %s", game.name);

    this.games.push(game);
    this.saveToFile(this.localFilePath);
  }

  public deleteGame(id) : void {
    console.log("delete game: %s", id);

    this.games = this.games.filter(game => game.id !== parseInt(id));
    this.saveToFile(this.localFilePath);
  }

  public getGame(id : number) : Game {
    return this.games.filter((game) => { return game.id === id })[0];
  }

  public getGames() : Array<Game> {
    return this.games;
  }
}
