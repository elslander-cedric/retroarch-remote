import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GameService } from "../../services/game.service";
import { Game } from "../../shared/game";
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component"
import { CarouselComponent } from "../carousel/carousel.component";
import { GameOverviewModalComponent } from "../game-overview-modal/game-overview-modal.component"

@Component({
  selector: 'suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {

  @ViewChild(CarouselComponent) carousel : CarouselComponent;

  public games : Game[] = [];

  constructor(
    private gameService: GameService,
    private modalService: NgbModal) {};

  public ngOnInit(): void {
    this.gameService.getMostPopular()
      .then((games : Array<Game>) => {
        this.games = games;
      })
      .catch((err : never) => this.onUserError(`error occured while getting top rated games: ${err}`));
  }

  public ngAfterViewInit() {}

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
        this.gameService.add(game);
      }
    });
  }
}
