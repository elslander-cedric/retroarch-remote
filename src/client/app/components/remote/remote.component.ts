import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GameService } from "../../services/game.service";
import { WebSocketService } from "../../services/websocket.service";
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component"

import { Game } from "../../shared/game";

@Component({
  selector: 'remote',
  templateUrl: './remote.component.html',
  styleUrls: ['./remote.component.css']
})
export class RemoteComponent implements OnInit {
  // TODO-FIXME: should be set by some event/emitter
  public running : boolean = false;

  constructor(
    private gameService : GameService,
    private webSocketService : WebSocketService,
    private modalService: NgbModal){};

  public ngOnInit() : void {
    this.webSocketService.games.subscribe((games: Game[]) => {
      console.log(`remote - update running state ...`);
      this.running = !!games.find((game : Game) => game.running);
    });
  }

  public retrarchCmd(command : string) : void {
    this.gameService.retroArchCommand(command)
      .then(() => console.log("successfully executed command: %s", command))
      .catch((err : never) => this.onUserError(`error occured while executing command: ${err}`));
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
