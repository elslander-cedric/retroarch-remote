import { Injectable } from "@angular/core";
import { Headers, Http, Request, Response, RequestOptions, BaseRequestOptions, RequestMethod, Jsonp, URLSearchParams } from "@angular/http";

import 'rxjs/add/operator/toPromise';

import { Observable }     from 'rxjs';
import { Subject }    from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';

import { Game } from "../shared/game";

export class DefaultRequestOptions extends BaseRequestOptions {
  headers : Headers = new Headers({ 'Content-Type': 'application/json' });
}

@Injectable()
export class GameService {

  //const gamesUrl = `http://${ location.host }:1337/games`;
  private baseUrl : string = '/games';
  private eventEmitter = new Subject();
  private subscriptions : Object = {};

  constructor(private http: Http, private jsonp : Jsonp) {}

  public subscribe(referer : any, eventHandler : () => void) : void {
    this.subscriptions[referer] = this.eventEmitter.asObservable().subscribe(eventHandler);
  }

  public unsubscribe(referer : any) : void {
    return this.subscriptions[referer].unsubscribe();
  }

  public getGames() : Promise<Game[]> {
    const url = `${this.baseUrl}/list/`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json().data as Game[])
      .catch(this.handleError)
  }

  public getAvailable(offset, limit) : Promise<Game[]> {
    const url = `${this.baseUrl}/available/?offset=${offset}&limit=${limit}`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json().data as Game[])
      .catch(this.handleError)
  }

  public getMostPopular(offset, limit) : Promise<Game[]> {
    const url = `${this.baseUrl}/most-popular/?offset=${offset}&limit=${limit}`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json().data as Game[])
      .catch(this.handleError)
  }

  public launch(game: Game) : Promise<Game> {
    const url = `${this.baseUrl}/launch/`;

    let params = new URLSearchParams();
    params.set('id', `${game.id}`);
    params.set('platform', `${game.platform}`);

    let options = new RequestOptions({
      search: params
    });

    // return this.jsonp => jsonp doesn't send http header content-type :(
    return this.http
      .get(url, options)
      .toPromise()
      .then(() => {
        this.eventEmitter.next(game);
        return game;
      })
      .catch(this.handleError);
  }

  public stop(game: Game) : Promise<Game> {
    const url = `${this.baseUrl}/stop/`;

    let params = new URLSearchParams();
    params.set('id', `${game.id}`);

    let options = new RequestOptions({
      search: params
    });

    // return this.jsonp => jsonp doesn't send http header content-type :(
    return this.http
      .get(url, options)
      .toPromise()
      .then(() => {
        this.eventEmitter.next(game);
        return game;
      })
      .catch(this.handleError);
  }

  public download(game: Game) : Promise<Game | any> {
    const url = `${this.baseUrl}/download/?id=${game.id}`;

    return this.http
      .get(url)
      .toPromise()
      .then(() => {
        this.eventEmitter.next(game);
        return game;
      })
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

    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      body: JSON.stringify(game)
    });

    return this.http
      .request(new Request(options))
      .toPromise()
      .then(() => {
        this.eventEmitter.next(game);
      })
      .catch(this.handleError);
  }

  public update(game: Game) : Promise<Game | any> {
    const url = `${this.baseUrl}/update/`;

    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      body: JSON.stringify(game)
    });

    return this.http
      .request(new Request(options))
      .toPromise()
      .catch(this.handleError);
  }

  public remove(game : Game) : Promise<Game | any> {
    const url = `${this.baseUrl}/delete/?id=${game.id}`;

    return this.http
      .get(url)
      .toPromise()
      .then(() => {
        this.eventEmitter.next(game);
      })
      .catch(this.handleError);
  }

  public retrarchCommand(command : string) : Promise<any> {
    const url = `/retroarch/?command=${command}`;

    return this.http
      .get(url)
      .toPromise()
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
