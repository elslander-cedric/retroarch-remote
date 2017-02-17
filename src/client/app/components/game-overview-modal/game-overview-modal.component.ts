import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Game } from '../../shared/game';

@Component({
  selector: 'app-game-overview-modal',
  templateUrl: './game-overview-modal.component.html',
  styleUrls: ['./game-overview-modal.component.css']
})
export class GameOverviewModalComponent implements OnInit {

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public add(game : Game) : void {
    // this.activeModal.close();
  }
}
