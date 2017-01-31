import * as http from 'http';
import * as querystring from 'querystring';
import * as xml2js from 'xml2js';
import * as sync_request  from 'sync-request';

import { Config } from "./Config";
import { Game } from "./Game";

export class GamesDbCachingService {
  private config : Config;

  constructor(config : Config) {
      this.config = config;
  }

  public search(name : string, callback) : void {
    // see http://stackoverflow.com/questions/22918573/giantbomb-api-work
    let options = {
      hostname: 'www.giantbomb.com',
      port: 80,
      path: '/api/games/?' + querystring.stringify({
        api_key: this.config.get("giantbombAPIKey"),
        limit: 10,
        format: "json",
        field_list: "id,name,deck,description,image,platforms,original_game_rating,original_release_date",
        sort: "name:asc",
        filter: `name:${name},platforms:21` // TODO-FIXME: limited to NES platform for now
      }),
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
      },
      json: true
    };

    http.request(options, (response) => {
      let responseBody = [];

      // console.log(`STATUS: ${response.statusCode}`);

      response
      .on('data', (chunk) => {
        responseBody.push(chunk);
      })
      .on('end', () => {
        let jsonResponse = JSON.parse(Buffer.concat(responseBody).toString());

        if(jsonResponse.status_code === 1) { // OK
          console.log('Found ' + jsonResponse.number_of_total_results + ' results for ' + name);
          callback(jsonResponse.results);
        } else {
          console.log(`error with request: ${jsonResponse.error}`);
        }
      })
      .on('error', (e) => {
        console.log(`problem with response: ${e.message}`);
      });

    }).on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
    }).end();
  }
}
