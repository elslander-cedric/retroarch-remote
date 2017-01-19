import {Component,OnInit,OnDestroy} from "@angular/core";
import {GameService} from "../../shared/game/game.service";
import {Game} from "../../shared/game/game";

import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {

  games : Game[] = [];
  gameAddedSubscription : Subscription;
  gameRemovedSubscription : Subscription;

  constructor(private gameService: GameService) {
    this.gameAddedSubscription = this.gameService.gameAdded$.subscribe(() => {
      this.update();
    });
    this.gameRemovedSubscription = this.gameService.gameRemoved$.subscribe(() => {
      this.update();
    });
  };

  ngOnInit(): void {
    this.update();
  }

  ngOnDestroy() : void {
    this.gameAddedSubscription.unsubscribe();
    this.gameRemovedSubscription.unsubscribe();
  }

  update() : void {
    console.log("updating list of games");
    this.gameService.getGames().then(games => this.games = games);
  }

  download(game : Game) : void {
    console.log("download game:", game.name);
    this.gameService.download(game);
  }

  launch(game : Game) : void {
    console.log("launch game:", game.name);
    this.gameService.launch(game);
  }

  stop(game : Game) : void {
    console.log("stop game:", game.name);

  }

  remove(game : Game) : void {
    console.log("delete game:", game.name);
    this.gameService.remove(game);
  }
}
