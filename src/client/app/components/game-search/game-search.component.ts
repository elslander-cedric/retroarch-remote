import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { GameService } from "../../services/game.service";
import { WebSocketService } from "../../services/websocket.service";
import { Game } from "../../shared/game";
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component"

@Component({
  selector: 'game-search',
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.css']
})

export class GameSearchComponent implements OnInit {
  public model: any;
  public searching : boolean = false;
  public searchFailed : boolean = false;

  constructor(
    private gameService : GameService,
    private webSocketService : WebSocketService,
    private modalService: NgbModal){};

  ngOnInit() {}

  public resultFormatter = (game: Game) => game.name;

  public inputFormatter = (game: Game) => game.name;

  public search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.gameService.search(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching = false);

  public addGame(game : Game) : Promise<Game> {
    console.log("add game:", game.name);

    return this.gameService
      .add(game)
      .then(() => console.log("successfully added game: %s", game.name))
      .catch((err : never) => this.onUserError(`error occured while adding game: ${err}`));
  }

  public retrarchCmd(command : string) : void {
    this.gameService.retroArchCommand(command)
      .then(() => console.log("successfully executed command: %s", command))
      .catch((err : never) => this.onUserError(`error occured while executing command: ${err}`));
  }

  public exit() : void {
    this.webSocketService.stop()
      .then((_game : Game) => console.log("successfully stopped game: %s", _game.name))
      .catch((err : never) => this.onUserError(`error occured while stopping game: ${err}`));
  }

  public onUserError(error : string) : void {
    console.log("open confirm modal");
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.result
      .then((result) => console.log("modal closed with result: %s", result))
      .catch((result) => console.log("modal closed with error: %s", result));
    modalRef.componentInstance.title = 'Game Search - Error occured';
    modalRef.componentInstance.message = error;
  }
}
