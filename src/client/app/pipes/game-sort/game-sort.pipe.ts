import { Pipe, PipeTransform } from '@angular/core';

import { Game } from '../../shared/game';

@Pipe({
  name: 'gameSort'
})
export class GameSortPipe implements PipeTransform {

  transform(games : Game[], filters: any[]): any {
    return games.sort((a: Game, b : Game) => a.rating > b.rating ? -1 : (a.rating === b.rating ? 0 : 1));
  }

}
