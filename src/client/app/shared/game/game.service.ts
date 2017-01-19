import {Injectable} from "@angular/core";
import {Headers,Http,Request,Response,RequestOptions,RequestMethod} from "@angular/http";

import 'rxjs/add/operator/toPromise';

import { Observable }     from 'rxjs';
import { Subject }    from 'rxjs/Subject';

import {Game} from "./game";

@Injectable()
export class GameService {

  //const gamesUrl = `http://${ location.host }:1337/games`;
  private baseUrl : string = 'http://localhost:1337/games';

  private gameAddedSource = new Subject();
  private gameRemovedSource = new Subject();
  gameAdded$ = this.gameAddedSource.asObservable();
  gameRemoved$ = this.gameRemovedSource.asObservable();

  constructor(private http: Http) {}

  getGames() : Promise<Game[]> {
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

  launch(game: Game) : void {
    const url = `${this.baseUrl}/launch/?id=${game.id}`;

    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    this.http
      .get(url, { headers: headers })
      .toPromise()
      .then()
      .catch(this.handleError);
  }

  download(game: Game) : void {
    const url = `${this.baseUrl}/download/?id=${game.id}`;

    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    this.http
      .get(url, { headers: headers })
      .toPromise()
      .then()
      .catch(this.handleError);
  }

  search(term: string): Observable<Game[]> {
    const url = `${this.baseUrl}/search/?name=${term}`;

    return this.http
      .get(url)
      .map((response: Response) => response.json().data as Game[])
      .catch(this.handleError);
  }

  add(game : Game) : void {
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

    this.http
      .request(new Request(options))
      .toPromise()
      .then(() => {
        console.log("notify subscribers of gameAddedSource");
        this.gameAddedSource.next();
      })
      .catch(this.handleError);
}

  remove(game : Game) : void {
    const url = `${this.baseUrl}/delete/?id=${game.id}`;

    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    this.http
      .get(url, { headers: headers })
      .toPromise()
      .then(() => {
        console.log("notify subscribers of gameRemovedSource");
        this.gameRemovedSource.next();
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
