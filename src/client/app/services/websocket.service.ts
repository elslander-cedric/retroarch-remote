import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { Observable }     from 'rxjs';
import { Subject }    from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';

import { Game } from "../shared/game";

@Injectable()
export class WebSocketService {

  private ws : WebSocket;

  public games_ : Game[];
  public games = new Subject<Game[]>();

  constructor() {
    this.connect();
  }

  public connect() : void {
    // TODO-FIXME : doesn't work :(
    this.ws = new WebSocket(`ws://${location.host}/ws"`);
    // this.ws = new WebSocket(`ws://localhost:1338/ws"`);

    this.ws.onerror = (err) => console.log(`websocket onerror ${err}`);
    this.ws.onopen = () => {
      console.log(`websocket onopen`);
      this.send({ action: 'list' });
    };

    this.ws.onmessage = (message : MessageEvent) => {
      console.log(`websocket onmessage: ${message.data}`);

      let data = JSON.parse(message.data);

      if(data.games) {
        this.games_ = data.games;
        this.games.next(data.games);
      }
    }

    this.ws.onclose = (close : CloseEvent) => {
      console.log(`websocket onclose`);
      setTimeout(() => { this.connect() }, 1000);
    }
  }

  public launch(game: Game) : Promise<Game|any> {
    return this.send({ action: 'launch', game: game });
  }

  public stop() : Promise<Game|any> {
    return this.send({ action: 'stop' });
  }

  public add(game : Game) : Promise<Game|any> {
    return this.send({ action: 'add', game: game });
  }

  public update(game: Game) : Promise<Game|any> {
    return this.send({ action: 'update', game: game });
  }

  public remove(game : Game) : Promise<Game|any> {
    return this.send({ action: 'remove', game: game });
  }

  public send(data) : Promise<Game|any> {
    return new Promise((resolve, reject) =>  {
      this.onMessage(resolve, reject);
      this.ws.send(JSON.stringify(data));
    })
  }

  public onMessage(resolve, reject) : void {
    this.ws.onmessage = (message : MessageEvent) => {
      console.log(`websocket onmessage: ${message.data}`);

      let data = JSON.parse(message.data);

      if(data.err) {
        reject(data.err);
      } else {
          switch(data.action) {
            case 'add':
              this.games_ = this.games_.concat(data.game);
              break;

            case 'launch':
              this.games_.find((game) => game.id === data.game.id).running = true;
              break;

            case 'stop':
              this.games_.forEach(game => game.running = false);
              break;
          }

          resolve(data.result);
      }

      if(data.games) {
        this.games_ = data.games;
      }

      this.games.next(this.games_);
    }
  }
}
