import { IncomingMessage, ServerResponse } from "http";

export interface RequestHandler {

  preHandle(request: IncomingMessage, response: ServerResponse): void;
  handle(request: IncomingMessage, response: ServerResponse): void;
  postHandle(request: IncomingMessage, response: ServerResponse): void;
}
