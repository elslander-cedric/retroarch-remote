import { Component, OnInit, OnDestroy } from "@angular/core";
import { MaterialModule } from '@angular/material';

import { Subscription }   from 'rxjs/Subscription';

import { GameService } from "../../shared/game/game.service";
import { Game } from "../../shared/game/game";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {
  public games : Game[] = [];
  public gameAddedSubscription : Subscription;
  public gameRemovedSubscription : Subscription;

  constructor(private gameService: GameService) {
    this.gameAddedSubscription = this.gameService.gameAdded$.subscribe(() => {
      this.update();
    });
    this.gameRemovedSubscription = this.gameService.gameRemoved$.subscribe(() => {
      this.update();
    });
  };

  public ngOnInit(): void {
    this.update();
  }

  public ngOnDestroy() : void {
    this.gameAddedSubscription.unsubscribe();
    this.gameRemovedSubscription.unsubscribe();
  }

  public update() : void {
    console.log("updating list of games");
    this.gameService.getGames()
      .then((games : Array<Game>) => {
        console.log("successfully updated list of games");
        this.games = games;
      })
      .catch((err : never) => console.log("error occured while updating list of games: %", err));
  }

  public download(game : Game) : void {
    console.log("downloading game:", game.name);
    this.gameService.download(game)
      .then((game : Game) => console.log("successfully downloaded game: %", game.name))
      .catch((err : never) => console.log("error occured while downloading game: %", err));
  }

  public launch(game : Game) : void {
    console.log("launching game:", game.name);
    this.gameService.launch(game)
      .then((game : Game) => console.log("successfully launched game: %", game.name))
      .catch((err : never) => console.log("error occured while launching game: %", err));
  }

  public stop(game : Game) : void {
    console.log("stopping game:", game.name);
    // TODO-FIXME

    throw Error("stop game not implemented yet");
  }

  public remove(game : Game) : void {
    console.log("deleting game:", game.name);
    this.gameService.remove(game)
      .then((game : Game) => console.log("successfully removed game: %", game.name))
      .catch((err : never) => console.log("error occured while removing game: %", err));
  }
}
