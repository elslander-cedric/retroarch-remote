import * as child_process from  'child_process';
import * as unzip from 'unzip';
import * as fs from 'fs';
import * as http from "http";
import {GamesDbCachingService} from "./GamesDbCachingService";

export class Game {

  public id;
  public name;
  public summary;
  public description;
  public downloadUrl;
  public platforms;
  public image;
  public rating;
  public releasedate;

  private downloadDir = "/home/cedric/Downloads/";

  constructor(id : number) {
    this.id = id;
  }

  public execute() {
    let pathGame = this.downloadDir + this.name + ".nes";

    let command = `/usr/bin/retroarch -L /usr/lib/libretro.so ${pathGame}`;

    child_process.exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }

  public launch() {
    let pathGame = this.downloadDir + this.name + ".nes";

    fs.exists(pathGame, (exists: boolean) => {
      if(!exists) {
        //this.downloadArchive(this.execute);
      } else {
        this.execute();
      }
    });
  }

  public updateInfo() : void {
    new GamesDbCachingService().getGame(this);
  }

  public downloaded() : boolean {
    let pathGame = this.downloadDir + this.name + ".nes";
    return fs.existsSync(pathGame);
  }
}
