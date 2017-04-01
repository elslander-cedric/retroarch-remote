import { Pipe, PipeTransform } from '@angular/core';

import { Game } from '../../shared/game';

@Pipe({
  name: 'gameFilter',
  pure: false
})
export class GameFilterPipe implements PipeTransform {
  public transform(games : Game[], filters: any[]): Array<Game> {
    return games.filter((game) => {
      return filters.every((filter) => {
        switch(filter.matcher) {
          case 'platform':
            return filter.selected || filter.value !== game.platform;
          case 'name':
            return filter.value === '' || game.name.toLowerCase()
              .indexOf(filter.value.toLowerCase()) !== -1;
          default:
            return true;
        }
      });
    });
  }

}
