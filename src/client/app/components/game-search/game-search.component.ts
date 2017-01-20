import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { GameService } from "../../shared/game/game.service";
import { Game } from "../../shared/game/game";

@Component({
  selector: 'game-search',
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.css']
})

export class GameSearchComponent {
  public model: any;
  public searching : boolean = false;
  public searchFailed : boolean = false;

  constructor(private gameService : GameService){};

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

  public resultFormatter = (game: Game) => game.name;

  public inputFormatter = (game: Game) => game.name;

  public addGame(game : Game) : Promise<Game> {
    console.log("add game:", game.name);

    return this.gameService.add(game);
  }
}
