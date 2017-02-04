import { RequestHandler } from "./RequestHandler";

export class RequestProcessor {
  private handlers = [];

  constructor() {};

  public addHandler (path : string, handler : RequestHandler) : RequestProcessor {
    this.handlers.push({ path: path, handler: handler });
    return this;
  }

  public getHandler(path : string) : RequestHandler {
    return this.handlers.reduce((accumulator, currentValue) => {
      return (currentValue.path === path ? currentValue : accumulator);
    }).handler;
  }
}
