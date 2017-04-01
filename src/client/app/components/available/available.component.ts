import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable }        from 'rxjs/Observable';
import { Subject }        from 'rxjs/Subject';

import 'rxjs/Observable';
import 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/scan';

import { GameService } from "../../services/game.service";
import { WebSocketService } from "../../services/websocket.service";
import { Game } from "../../shared/game";
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component"
import { CarouselComponent } from "../carousel/carousel.component";
import { GameOverviewModalComponent } from "../game-overview-modal/game-overview-modal.component"

@Component({
  selector: 'available',
  templateUrl: './available.component.html',
  styleUrls: ['./available.component.css']
})
export class AvailableComponent implements OnInit, AfterViewInit {

  @ViewChild(CarouselComponent) carousel : CarouselComponent;

  public games : Observable<Game[]>;
  private gamesQuery = new Subject<number>();

  constructor(
    private gameService: GameService,
    private webSocketService : WebSocketService,
    private modalService: NgbModal) {};

  public ngOnInit(): void {
    this.games = this.gamesQuery
      .map((offset) => Math.round(offset/100))
      .distinct()
      .concatMap((offset) => this.gameService.getAvailable(offset, 1))
      .scan((acc, curr) => acc.concat(curr));
  }

  public ngAfterViewInit() {
      [0,1,2,3,4,5,6,7,8,9].forEach((i) => this.gamesQuery.next(i * 100));
  }

  public update(offset) : void {
    this.gamesQuery.next(offset + 1000);
  }

  public onUserError(error : string) : void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.result
      .then((result) => console.log("modal closed with result: %s", result))
      .catch((result) => console.log("modal closed with error: %s", result));
    modalRef.componentInstance.title = 'Dashboard - Error occured';
    modalRef.componentInstance.message = error;
  }

  public showGameOverview(game : Game) : void {
    const modalRef = this.modalService.open(GameOverviewModalComponent);
    modalRef.componentInstance.game = game;
    modalRef.result.then((result) => {
      if(result == 'add') {
        //this.gameService.add(game);
        this.webSocketService.add(game);
      }
    });
  }
}
