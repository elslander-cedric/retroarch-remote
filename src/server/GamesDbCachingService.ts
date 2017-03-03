import * as http from 'http';
import * as querystring from 'querystring';
import * as sync_request  from 'sync-request';
import { IncomingMessage } from 'http';
import { Observable, Observer } from 'rxjs/Rx';

import { Config } from "./Config";
import { Game } from "./Game";

export class GamesDbCachingService {
  private config : Config;

  constructor(config : Config) {
      this.config = config;
  }

  public searchByName(name : string) : Observable<Array<Game>> {
    let path = '/api/games/?' + querystring.stringify({
      api_key: this.config.get("giantbombAPIKey"),
      limit: 5,
      format: "json",
      field_list: "id,name,deck,description,image,platforms,original_game_rating,original_release_date",
      sort: "name:asc",
      filter: `name:${name},platforms:21` // TODO-FIXME: limited to NES platform for now
    });

    return this.query(path);
  }

  public searchById(id : number) : Observable<Array<Game>> {
    let path = '/api/games/?' + querystring.stringify({
      api_key: this.config.get("giantbombAPIKey"),
      limit: 5,
      format: "json",
      field_list: "id,name,deck,description,image,platforms,original_game_rating,original_release_date",
      filter: `id:${id},platforms:21` // TODO-FIXME: limited to NES platform for now
    });

    return this.query(path);
  }

  public topRated(offset : number = 0, limit : number = 0) : Observable<Array<Game>> {
    let path = '/api/games/?' + querystring.stringify({
      api_key: this.config.get("giantbombAPIKey"),
      limit: limit,
      offset: offset,
      format: "json",
      field_list: "id,name,deck,description,image,platforms,original_game_rating,original_release_date",
      sort: "original_game_rating:desc",
      filter: "platforms:21" // TODO-FIXME: limited to NES platform for now
    });

    return this.query(path);
  }

  public mostPopular(offset:number = 0, limit : number = 0) : Observable<Array<Game>> {
    let path = '/api/games/?' + querystring.stringify({
      api_key: this.config.get("giantbombAPIKey"),
      limit: limit,
      offset: offset,
      format: "json",
      field_list: "id,name,deck,description,image,platforms,original_game_rating,original_release_date",
      sort: "number_of_user_reviews:desc",
      filter: "platforms:21" // TODO-FIXME: limited to NES platform for now
    });

    return this.query(path);
  }

  private query(path : string) : Observable<Array<Game>> {
    // see http://stackoverflow.com/questions/22918573/giantbomb-api-work
    let options = {
      hostname: 'www.giantbomb.com',
      port: 80,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
      },
      json: true
    };

    return this.send(options)
      .reduce((acc: Buffer, value: Buffer) => Buffer.concat([acc, value]))
      .map((buffer : Buffer) => {
        let jsonResponse = JSON.parse(buffer.toString());

        if(jsonResponse.status_code === 1) { // OK
          let games : Array<any> = jsonResponse.results;

          return games.map((game) => {
            return {
              id: game.id,
              name: game.name,
              platforms: game.platforms.map(platform => platform.name).join(', '),
              summary: game.deck,
              description: game.description,
              rating: game.original_game_rating,
              image: game.image ? game.image.icon_url : undefined
            } as Game
          })
        } else {
          return Observable.of(new Array<Game>());
        }
      });
  }

  private send(options) : Observable<Buffer> {
    return Observable.create((observer : Observer<Buffer>) => {
      console.log(`[${options.method}] - ${options.path}`);

      http.request(options, (response) => {
        response
        .on('data', (chunk : Buffer) => observer.next(chunk))
        .on('end', () => observer.complete())
        .on('error', (e) => observer.error(e));
      }).end();
    });
  }

}
