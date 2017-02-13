import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GameService } from "../../services/game.service";
import { Game } from "../../shared/game";
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component"
import { CarouselComponent } from "../carousel/carousel.component";

@Component({
  selector: 'top-rated',
  templateUrl: './top-rated.component.html',
  styleUrls: ['./top-rated.component.css']
})
export class TopRatedComponent implements OnInit, AfterViewInit {

  @ViewChild(CarouselComponent) carousel : CarouselComponent;

  public games : Game[] = [];

  constructor(
    private gameService: GameService,
    private modalService: NgbModal) {};

  public ngOnInit(): void {
    this.update();
  }

  public ngAfterViewInit() {
  }

  public update() : void {
    console.log("updating list of games");
    this.gameService.getTopRated()
      .then((games : Array<Game>) => {
        this.games = games;
      })
      .catch((err : never) => this.onUserError(`error occured while getting top rated games: ${err}`));
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
