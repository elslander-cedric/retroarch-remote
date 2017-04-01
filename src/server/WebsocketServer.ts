import * as _ws from 'ws';

import { Server } from "http";

import { GameRegistry } from "./GameRegistry";
import { GameLibrary } from "./GameLibrary";
import { GameTaskRunner } from "./GameTaskRunner";
import { Game } from "./Game";

export class WebsocketServer {
  private server : _ws.Server;
  private httpServer : Server;
  private gameRegistry : GameRegistry;
  private gameLibrary : GameLibrary;
  private gameTaskRunner : GameTaskRunner;

  constructor(
    httpServer: Server,
    gameRegistry : GameRegistry,
    gameLibrary : GameLibrary,
    gameTaskRunner : GameTaskRunner) {
    this.httpServer = httpServer;
    this.gameRegistry = gameRegistry;
    this.gameLibrary = gameLibrary;
    this.gameTaskRunner = gameTaskRunner;
  };

  public start() : void {
    console.log("starting ws server ...");

    // this.server = new _ws.Server({ port: 1338 });
    this.server = new _ws.Server({ server: this.httpServer });

    this.server.on('connection', (ws : _ws.WebSocket) => {
      console.log(`connection from ${ws}`);

      ws.on('close', (code, reason) => console.log('ws - close'));
      ws.on('error', (err) => console.log('ws - error: %s', err));
      ws.on('open', () => console.log('ws - open: %s'));

      ws.on('message', (message) => {
        console.log('ws - message: %s', message);

        let data = JSON.parse(message);

        switch(data.action) {
          case 'list':
            ws.send(JSON.stringify({ games: this.gameRegistry.games }));
            break;

          case 'add':
            this.gameRegistry.add(data.game)
              .then((result) => ws.send(JSON.stringify({
                action: data.action,
                result: result,
                game: data.game })))
              .then(() => this.sendNotifications(ws))
              .catch((err) => ws.send(JSON.stringify({ err: err })));
              break;

          case 'launch':
            let game : Game = this.gameLibrary.lookup(
              parseInt(data.game.id),
              parseInt(data.game.platform));

            this.gameTaskRunner.launch(game)
              .then((result) => {
                this.gameRegistry.lookup(game.id).running = true;

                ws.send(JSON.stringify({
                  action: data.action,
                  result: result,
                  game: this.gameRegistry.lookup(game.id)
                }));
              })
              .then(() => this.sendNotifications(ws))
              .catch((err) => ws.send(JSON.stringify({ err: err })));
              break;

          case 'stop':
            this.gameTaskRunner.stop()
              .then((result) => {
                this.gameRegistry.games.forEach(game => game.running = false);

                ws.send(JSON.stringify({
                  action: data.action,
                  result: result
                }));
              })
              .then(() => this.sendNotifications(ws))
              .catch((err) => ws.send(JSON.stringify({ err: err })));
              break;
        }
      });
    });

    this.server.on('headers', (headers) => console.log('headers: %s', headers));
    this.server.on('listening', () => console.log('listening'));
    this.server.on('error', (err) => console.log('error: %s', err));

    this.gameRegistry.notifier.subscribe((games : Game[]) => {
      /*
      console.log("sending notifications to clients ...");
      this.server.clients.forEach((client : _ws.WebSocket) => {
        if (client.readyState === 1) { // OPEN
          client.send(JSON.stringify({ games: games }));
        }
      });
      */
    });
  }

  public sendNotifications(client : _ws.WebSocket) : void {
    console.log("sending notifications to clients ...");
    this.server.clients.forEach((client_ : _ws.WebSocket) => {
      if (client_ !== client && client_.readyState === 1) { // OPEN
        console.log("sending notification to client %s", client_);
        client_.send(JSON.stringify({ games: this.gameRegistry.games }));
      }
    });
  }

  public send(data) : void {
    this.server.send(data);
  }
}
