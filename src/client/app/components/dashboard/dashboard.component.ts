import { Component, OnInit, OnDestroy } from "@angular/core";
import { MaterialModule } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GameService } from "../../shared/game/game.service";
import { Game } from "../../shared/game/game";
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component"

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {
  public games : Game[] = [];

  constructor(private gameService: GameService, private modalService: NgbModal) {};

  public ngOnInit(): void {
    this.gameService.subscribe(this, () => { this.update(); });
    this.update();
  }

  public ngOnDestroy() : void {
    this.gameService.unsubscribe(this);
  }

  public update() : void {
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
    this.gameService.launch(game)
      .then((_game : Game) => console.log("successfully launched game: %s", _game.name))
      .catch((err : never) => this.onUserError(`error occured while launching game: ${err}`));
  }

  public stop(game : Game) : void {
    console.log("stopping game:", game.name);
    // TODO-FIXME
    throw Error("stop game not implemented yet");
  }

  public remove(game : Game) : void {
    console.log("removing game:", game.name);
    this.gameService.remove(game)
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
