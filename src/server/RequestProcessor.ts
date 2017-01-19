import {RequestHandler} from "./RequestHandler";

export class RequestProcessor {

  private handlers = [];
  private roothandler: RequestHandler;

  constructor() {};

  public addHandler (path : string, handler : RequestHandler) : RequestProcessor {
    this.handlers.push({ path: path, handler: handler });
    return this;
  }

  public setRoothandler(handler : RequestHandler) : RequestProcessor {
    this.roothandler =  handler;
    return this;
  }

  public getHandler(path : string) : RequestHandler {

    console.log("get handler for %s", path);

    let handlerDescriptor = this.handlers.filter((handlerDescriptor) => {
      return handlerDescriptor.path.indexOf(path) === 0;
    }).reduce((accumulator, currentValue) => {
      return accumulator.path.length < currentValue.path.length ? accumulator : currentValue;
    });

    return handlerDescriptor ? handlerDescriptor.handler : this.roothandler;
  }
}
