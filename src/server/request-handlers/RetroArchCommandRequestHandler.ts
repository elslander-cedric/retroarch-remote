import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";

import * as url from 'url';

import { JsonRequestHandler } from "./JsonRequestHandler";
import { RetroArchUDPCommandExecutor } from "../retroarch/RetroArchUDPCommandExecutor";

export class RetroArchCommandRequestHandler extends JsonRequestHandler {
  private retroArchUDPCommandExecutor : RetroArchUDPCommandExecutor;

  constructor(retroArchUDPCommandExecutor : RetroArchUDPCommandExecutor) {
    super();
    this.retroArchUDPCommandExecutor = retroArchUDPCommandExecutor;
  };

  public handle(request: IncomingMessage, response: ServerResponse): void {
    this.preHandle(request, response);

    let requestUrl : Url = url.parse(request.url, true);
    let command = requestUrl.query['command'];

    this.retroArchUDPCommandExecutor.send(command)
      .then(() => {
        response.statusCode = 200; // ok
        this.postHandle(request, response);
      }, (err) => {
        response.statusCode = 400; // bad request
        response.write(JSON.stringify({ errors: [err] }));
        this.postHandle(request, response);
      })
      .catch((err) => {
        response.statusCode = 500; // internal server error
        response.write(JSON.stringify({ errors: [err] }));
        this.postHandle(request, response);
      });
  }
}
