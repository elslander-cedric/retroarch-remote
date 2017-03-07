import { IncomingMessage, ServerResponse } from "http";

import { RequestHandler } from "./RequestHandler";

export abstract class JsonRequestHandler implements RequestHandler {

  public preHandle(request: IncomingMessage, response: ServerResponse): void {
    response.setHeader('Content-Type', 'application/json');
  }

  abstract handle(request: IncomingMessage, response: ServerResponse): void;

  public postHandle(request: IncomingMessage, response: ServerResponse): void {
    response.end();
  }
}
