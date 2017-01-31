import { Injectable } from "@angular/core";
import { Headers, Http, Request, Response, RequestOptions,RequestMethod, Jsonp, URLSearchParams } from "@angular/http";

import 'rxjs/add/operator/toPromise';

import { Observable }     from 'rxjs';
import { Subject }    from 'rxjs/Subject';

import { Game } from "./game";

@Injectable()
export class GameService {

  //const gamesUrl = `http://${ location.host }:1337/games`;
  private baseUrl : string = '/games';

  private gameAddedSource = new Subject();
  private gameRemovedSource = new Subject();
  gameAdded$ = this.gameAddedSource.asObservable();
  gameRemoved$ = this.gameRemovedSource.asObservable();

  constructor(private http: Http, private jsonp : Jsonp) {}

  public getGames() : Promise<Game[]> {
    const url = `${this.baseUrl}/list`;

    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .get(url, { headers: headers })
      .toPromise()
      .then(response => response.json().data as Game[])
      .catch(this.handleError)
  }

  public launch(game: Game) : Promise<Game> {
    const url = `${this.baseUrl}/launch/?id=${game.id}`;

    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let params = new URLSearchParams();
    params.set('id', `${game.id}`);

    let options = {
      headers: headers,
      search: params
    };

    return this.jsonp
      .get(url, options)
      .toPromise()
      .then(() => {
        console.log("launched game %s", game.name);
        return game;
      })
      .catch(this.handleError);
  }

  public download(game: Game) : Promise<Game | any> {
    const url = `${this.baseUrl}/download/?id=${game.id}`;

    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .get(url, { headers: headers })
      .toPromise()
      .then(() => game)
      .catch(this.handleError);
  }

  public search(term: string): Observable<Game[]> {
    const url = `${this.baseUrl}/search/?name=${term}`;

    return this.http
      .get(url)
      .map((response: Response) => response.json().data as Game[])
      .catch(this.handleError);
  }

  public add(game : Game) : Promise<Game | any> {
    const url = `${this.baseUrl}/add/`;

    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      headers: headers,
      body: JSON.stringify(game)
    });

    return this.http
      .request(new Request(options))
      .toPromise()
      .then(() => {
        console.log("notify subscribers of gameAddedSource");
        this.gameAddedSource.next(game);
      })
      .catch(this.handleError);
  }

  public remove(game : Game) : Promise<Game | any> {
    const url = `${this.baseUrl}/delete/?id=${game.id}`;

    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .get(url, { headers: headers })
      .toPromise()
      .then(() => {
        console.log("notify subscribers of gameRemovedSource");
        this.gameRemovedSource.next(game);
      })
      .catch(this.handleError);
  }

  private handleError(response: Response | any) : Promise<any> {
    let errMsg: string;

    if (response instanceof Response) {
      const body = response.json() || '';
      const errors = body.errors || JSON.stringify(body);
      errMsg = `${response.status} - ${response.statusText || ''} ${errors.join(', ')}`;
    } else {
      errMsg = response.message ? response.message : response.toString();
    }

    console.error(errMsg);

    return Promise.reject(errMsg);
    //return Observable.throw(errMsg);
  }
}
