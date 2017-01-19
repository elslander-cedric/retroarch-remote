import {IncomingMessage,ServerResponse} from "http";
import {RequestHandler} from "./RequestHandler";

export abstract class JsonRequestHandler implements RequestHandler {

  abstract handle(request: IncomingMessage, response: ServerResponse): void;

}
