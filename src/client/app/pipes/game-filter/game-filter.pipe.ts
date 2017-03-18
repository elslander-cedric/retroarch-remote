import { Pipe, PipeTransform } from '@angular/core';

import { Game } from '../../shared/game';

@Pipe({
  name: 'gameFilter',
  pure: false
})
export class GameFilterPipe implements PipeTransform {
  public transform(games : Game[], filters: any[]): Array<Game> {
    return games.filter((game) => {
      return filters.find((filter) => {
        return filter.selected && filter.type === 'platform' && filter.matcher === game.platform;
      });
    });
  }

}
