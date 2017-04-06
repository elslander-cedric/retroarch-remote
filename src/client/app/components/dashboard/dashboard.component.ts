import { Component, OnInit, OnDestroy } from "@angular/core";
import { MaterialModule } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GameService } from "../../services/game.service";
import { WebSocketService } from "../../services/websocket.service";
import { Game } from "../../shared/game";
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component"

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {

  public game: Game;

  public games : Game[] = [];

  public filters : Array<any> = [
    {
      name: 'NES',
      type: 'chip',
      matcher: 'platform',
      value: 21,
      selected: true
    },{
      name: 'N64',
      type: 'chip',
      matcher: 'platform',
      view: 'chip',
      value: 43,
      selected: true
    },{
      name: 'two player',
      type: 'chip',
      matcher: 'nof-players',
      disabled: true
    },{
      name: 'name',
      type: 'text',
      matcher: 'name',
      value: ''
  }];

  constructor(
    private gameService: GameService,
    private webSocketService : WebSocketService,
    private modalService: NgbModal) {};

  public ngOnInit(): void {
    //this.gameService.subscribe(this, () => { this.list(); });

    this.webSocketService.games.subscribe((games: Game[]) => {
      console.log(`dashoard - update games ...`);
      this.games = games;
    });

    //this.list();
  }

  public ngOnDestroy() : void {
    //this.gameService.unsubscribe(this);
  }

  public onFilterInput(value) : void {
    this.filters.find(f => f.name === 'name').value = value;
  }

  public update(game : Game) : void {
    if(!game.rating) return;

    console.log("update game:", game.name);

    this.webSocketService.update(game)
      .then((_game : Game) => console.log("successfully updated game: %s", _game.name))
      .catch((err : never) => this.onUserError(`error occured while updating game: ${err}`));
  }

  public list() : void {
    console.log("updating list of games");
    this.gameService.getGames()
      .then((games : Array<Game>) => {
        console.log("successfully updated list of games");
        this.games = games;
      })
      .catch((err : never) => this.onUserError(`error occured while updating list of games: ${err}`));
  }

  public download(game : Game) : void {
    console.log("downloading game:", game.name);
    this.gameService.download(game)
      .then((_game : Game) => console.log("successfully downloaded game: %s", _game.name))
      .catch((err : never) => this.onUserError(`error occured while downloading game: ${err}`));
  }

  public launch(game : Game) : void {
    console.log("launching game:", game.name);
    this.webSocketService.launch(game)
      .then((_game : Game) => console.log("successfully launched game: %s", _game.name))
      .catch((err : never) => this.onUserError(`error occured while launching game: ${err}`));
  }

  public stop() : void {
    console.log("stopping game:");
    this.gameService.stop()
      .then((_game : Game) => console.log("successfully stopped game: %s", _game.name))
      .catch((err : never) => this.onUserError(`error occured while stopping game: ${err}`));
  }

  public remove(game : Game) : void {
    console.log("removing game:", game.name);
    this.webSocketService.remove(game)
      .then(() => console.log("successfully removed game: %s", game.name))
      .catch((err : never) => this.onUserError(`error occured while removing game: ${err}`));
  }

  public onUserError(error : string) : void {
    console.log("open confirm modal");
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.result
      .then((result) => console.log("modal closed with result: %s", result))
      .catch((result) => console.log("modal closed with error: %s", result));
    modalRef.componentInstance.title = 'Dashboard - Error occured';
    modalRef.componentInstance.message = error;
  }
}
