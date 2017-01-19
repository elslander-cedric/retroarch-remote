import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import {GameService} from "../../shared/game/game.service";
import {Game} from "../../shared/game/game";

@Component({
  selector: 'game-search',
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.css']
})

export class GameSearchComponent {

  public model: any;
  searching = false;
  searchFailed = false;

  constructor(private gameService : GameService){};

  search = (text$: Observable<string>) =>
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

  resultFormatter = (game: Game) => game.name;

  inputFormatter = (game: Game) => game.name;

  select = (game: Game) => console.log("selected:",game);

  selectItem = (a) => console.log("selected:",a);

  addGame = (game : Game) => {
    console.log("add game:", game.name);

    this.gameService.add(game);
  }
}
