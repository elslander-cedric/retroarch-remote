import { Pipe, PipeTransform } from '@angular/core';

import { Game } from '../../shared/game';

@Pipe({
  name: 'gameSort'
})
export class GameSortPipe implements PipeTransform {

  transform(games : Game[], filters: any[]): any {
    return games.sort((a: Game, b : Game) => b.rating - a.rating);
  }

}
